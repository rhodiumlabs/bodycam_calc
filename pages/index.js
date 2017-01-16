import React, {Component} from 'react'
import style from 'next/css';
import Container from './container';
import ReactTooltip from 'react-tooltip'
import _ from 'lodash';

let mixpanel = {track: (a) => console.log(a)};
if(typeof document !== 'undefined') {
  mixpanel = require('mixpanel-browser');
  mixpanel.init("2533434c0dfd027c72e10bb3909cfb2b");
}


const MANTA_RAY = 'MANTA_RAY';
const STING_RAY = 'STING_RAY';
const OPTION_STING_RAY_3G = 1;
const OPTION_STING_RAY_GPS = 2;
const OPTION_STING_RAY_MEMORY = 3;
const OPTION_STING_RAY_BATTERY = 4;

const OPTION_DOCKING_STATION_SIMPLE = 5;
const OPTION_DOCKING_STATION_ADVANCED = 6;
const OPTION_DOCKING_STATION_NONE = 7;
import {
  HARDWARE_COST_MULTIPLIER,
  TAXES_SHIPPING_MULTIPLIER,
  CAMERA_MANTA_RAY_COST,
  CAMERA_STING_RAY_COST,
  CAMERA_STING_RAY_3G,
  CAMERA_STING_RAY_GPS,
  CAMERA_STING_RAY_MEMORY,
  CAMERA_STING_RAY_BATTERY,
  DOCKING_STATION_SIMPLE,
  DOCKING_STATION_ADVANCED,
  PER_GIGABIT_COST,
  STORAGE_MULTIPLIER,
  YEARLY_SERVICE_COST,
  GIGABIT_PER_HOUR
} from './costs';

const costMap = {
  [OPTION_STING_RAY_3G] : CAMERA_STING_RAY_3G,
  [OPTION_STING_RAY_GPS] : CAMERA_STING_RAY_GPS,
  [OPTION_STING_RAY_MEMORY] : CAMERA_STING_RAY_MEMORY,
  [OPTION_STING_RAY_BATTERY] : CAMERA_STING_RAY_BATTERY,
  [OPTION_DOCKING_STATION_SIMPLE] : DOCKING_STATION_SIMPLE,
  [OPTION_DOCKING_STATION_ADVANCED] : DOCKING_STATION_ADVANCED,
  [OPTION_DOCKING_STATION_NONE] : 0,
}

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});


export const bodyStyle = style({
    marginTop: '4em',
    fontFamily: 'Work Sans',
    color: '#333',
    ' h1': {
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      color: 'rgb(26, 52, 69)'
    },
    '& dt': {
      marginBottom: '0'
    },
    '& input': {
      height: '20px'
    },
    '& label': {
      fontSize: '0.9em'
    }
})

export const headerUnder = style({
    marginBottom: '1em',
    marginTop: '1em',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    color: '#e9c77b'
});

export const subHeader = style({
    fontSize: '14px',

    color: 'rgb(26, 52, 69)',
    margin: 0,
    marginBottom: '0.5em'
});
export const ssubHeader = style({
    fontSize: '12px',
    marginTop: '0em',
    color: 'rgb(26, 52, 69)',
    opacity: 0.8,
});
export const priceStyle = style({
  float: 'right'
})
export const receipt = style({
  border: '1px dotted rgb(26, 52, 69)',
  padding: '1.5em',
  position: 'fixed',
  top: '4%',
  right: '4%',
  '& dd': {
    fontSize: '12px'
  },
  width: '400px'
})
export const optionStyle = style({
  cursor: 'pointer',
  fontSize: '11px',
  '& input': {
    height: '11px'
  },
  '&:hover': {
    background: '#EEE'
  }
})
export const styleCamBox = style({
    width: '40%',
    height: '200px',
    fontSize: '12px',
    display: 'inline-block',
    backgroundSize: 'cover',
    margin: '1em',
    padding: '0.4em',
    border: '2px dotted #CCC',
    cursor: 'pointer',
    '&:hover': {
      opacity: '0.5'
    }
})

const CameraOption = (props) => {
  return (
    <dl style={{width: '100%'}}>
    <dt 
      data-tip={'Equipped with the necessities: including picture, video and audio recording.'}
      className={styleCamBox} 
      style={{border: props.camera == MANTA_RAY ? '2px solid rgb(26, 52, 69)' : '', backgroundImage: "url('/static/MANTA_RAY.png')"}} 
      onClick={() => {props.selectCamera(MANTA_RAY); mixpanel.track("MANTA_RAY CLICKED");}}>
      Manta Ray
    </dt>
    <dt 
      data-tip={'Customizable with all necessities plus expandable memory, GPS, and 3G.'}
      className={styleCamBox} 
      style={{border: props.camera == STING_RAY ? '2px solid rgb(26, 52, 69)' : '',backgroundImage: "url('/static/STING_RAY.png')"}} 
      onClick={() => {props.selectCamera(STING_RAY); mixpanel.track("STING_RAY CLICKED");}}>
      Sting Ray
    </dt>
  </dl>);
}

const StingRayAdditions = (props) => {
  const generateOption = (text, tooltip, opt) => (
    <dt 
      className={optionStyle} 
      onClick={(e) => {
        props.selectOption(opt); 
        mixpanel.track(text + " CLICKED")
      }}
      data-tip={tooltip}
      > 
      <input 
        type="checkbox" 
        readOnly={true}
        checked={props.options[opt]} 
      /> {text}
    </dt>
  )

  return (
    <div>
      <h5 className={ssubHeader}>Sting Ray Features & Accessories</h5>
      <dl>  
        {generateOption('3G Option', 'This option allows SIM card to be added.<br /> The recorded video can be live-streamed to a remote device', OPTION_STING_RAY_3G)}
        {generateOption('GPS Option', 'Videos can have a location embedded at the time of recording', OPTION_STING_RAY_GPS)}
        {generateOption('Extra memory (+16GB)', '', OPTION_STING_RAY_MEMORY)}
        {generateOption('Extra battery', '', OPTION_STING_RAY_BATTERY)}
      </dl>
    </div>
  )
}

const DockingStation = (props) => {
  const generateOption = (text, tooltip, opt) => (
    <dt 
      className={optionStyle} 
      onClick={(e) => {
        props.onChange(opt); 
        mixpanel.track(text + " CLICKED")}
      } 
      data-tip={tooltip}
      > 
      <input 
        type="radio" 
        readOnly={true}
        checked={props.option == opt} 
        
      /> {text}
    </dt>
  )

  return (
    <div>
      <h5 className={ssubHeader}>Docking Station</h5>
      <dl>  
        {generateOption('Simple dock', 'Supports and charges 10 cameras. Personal computer required to allow data transfer. ', OPTION_DOCKING_STATION_SIMPLE)}
        {generateOption('Advanced dock with local storage', 'Supports and charges 20 cameras. Automatically saves and locally stores camera data.', OPTION_DOCKING_STATION_ADVANCED)}
        {generateOption('None','', OPTION_DOCKING_STATION_NONE)}
      </dl>
    </div>
  )
}

const RadioOptions = (props) => (
    <div>
      <div className="row">
        <div className="column">
          <h5 className={subHeader}>{props.title}</h5>
        </div>
      </div>
      <div className="row">
        <div className="column" style={{fontSize:'12px',marginBottom: '1em', paddingLeft: '2em'}}>
          <dl > 
              {props.options.map((op, i) => 
                <dt className={optionStyle} 
                    style={{display: 'inline-block', marginLeft: '1em'}} 
                    data-tip={op.tooltip}
                    onClick={() => {
                      props.onChange(op.value); 
                      mixpanel.track(op.text + " CLICKED")
                    }}>
                    <input 
                      type="radio" 
                      readOnly={true}
                      checked={props.value == op.value}   
                    /> {op.text}
                </dt>
              )}
          </dl>
        </div>
      </div>
    </div>
  )



export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
      camera: MANTA_RAY,
      additionalFeatures: {},
      dockingStation: OPTION_DOCKING_STATION_NONE,
      cameraQuantity: 500,
      dailyHours: 3,
      localSupport: 1,
      retainingPeriod: 12,
      options: {}
    }; 
    if(typeof document !== 'undefined') {
      window.onscroll = (e) => {
      }
    }
  }
  componentWillUpdate() {
    if(this.state.init) 
      this.setState({init: false});
  }

	render() {
    const cameraCost = () => {
      let cost = 0;
      if(this.state.camera == STING_RAY) {
        cost += CAMERA_STING_RAY_COST;
	      _.each(this.state.additionalFeatures, ((val, ft) => { val ? cost += costMap[ft] : null}));      
      }

      if(this.state.camera == MANTA_RAY) {
        cost += CAMERA_MANTA_RAY_COST;
      }
      
      return cost * markup;
    }
    let markup = HARDWARE_COST_MULTIPLIER(this.state.cameraQuantity) * TAXES_SHIPPING_MULTIPLIER;

    let totalCameraCost = this.state.cameraQuantity * cameraCost();
    let dockingStationCost = costMap[this.state.dockingStation] * Math.ceil(this.state.cameraQuantity/20) * markup;
    let totalHardwareCost = totalCameraCost + dockingStationCost;

    let totalRequiredStorage = (this.state.dailyHours * this.state.cameraQuantity * GIGABIT_PER_HOUR * this.state.retainingPeriod * 30);
    let yearlyMaintenanceFees = (totalRequiredStorage * PER_GIGABIT_COST * STORAGE_MULTIPLIER * 12);
    let yearlyMaintenanceFeesPerCam = this.state.cameraQuantity == 0 ? 0 : (yearlyMaintenanceFees / this.state.cameraQuantity);
    let recurringCosts = (this.state.localSupport == 1 ? YEARLY_SERVICE_COST(this.state.cameraQuantity) : 0) +  yearlyMaintenanceFees;
    
    return (
      <Container>
      <ReactTooltip multiline={true} place={'bottom'} effect={'solid'} />
      <div className={`${bodyStyle} container`}>
        <div className="row">
          <div className="column"><h1>Bodycam Calculator</h1></div>
        </div>
         <div className="row">
          <div className="column">
            <p style={{fontSize: '12px'}}>
              Welcome to rhodium's bodycam calculator. 
              Below please choose your options in hardware, 
              software and storage to see an estimated total
            </p>
          </div>
          <div className="column"/>
        </div>
        
        <div className="row">
          <div className="column">
            <div className="row">
              <h5 className={headerUnder}>Hardware Options</h5>
            </div>
            <div className="row">
              <div className="column">
              <h5 className={subHeader}> 1. Choose your camera </h5>
              </div>
            </div>
            <div className="row">
              <div className="column">
              <CameraOption 
                camera={this.state.camera} 
                selectCamera={(camera) => this.setState({camera})}
              />
              </div>
            </div>
          <div>

          <RadioOptions
            title='2. Number of cameras'
            options={[
                {text:"Pilot (100 Units)", value: 100}, 
                {text:"Mid-Level (500 Units)", value: 500}, 
                {text:"Full-scale (1000 Units)", value: 1000}
            ]}
            value={this.state.cameraQuantity}
            onChange={(cameraQuantity) => this.setState({cameraQuantity})}
          />
                <div className="row">
                  <div className="column"><h5 className={subHeader}> 3. Optional Features </h5></div>
                </div>
                <div className="row">
                <div className="column">
                  <DockingStation 
                    option={this.state.dockingStation}
                    onChange={(dockingStation) => this.setState({dockingStation})}
                  />
                </div>
                <div className="column">
                  <div style={{display: this.state.camera == STING_RAY ? 'block' : 'none'}}>
                  <StingRayAdditions 
                    options={this.state.additionalFeatures}
                    selectOption={(opt) => 
                      this.setState({additionalFeatures: Object.assign({}, this.state.additionalFeatures, {[opt]: !this.state.additionalFeatures[opt]})})}
                  />
                  </div>
                </div>
                </div>
              </div>
              <div className="row">
                <h5 className={headerUnder}>Maintenance & Storage Options</h5>
              </div>
              
              <RadioOptions
                title='4. How frequent are the police officers going to use the cameras'
                options={[
                    {text:"Minimal-use (0.5-1h/day)", value: 1}, 
                    {text:"Moderate-use (1-3h/day)", value: 3},
                    {text:"Heavy-use (4h-8h/day)", value: 8}
                ]}
                value={this.state.dailyHours}
                onChange={(dailyHours) => this.setState({dailyHours})}
              />
              <RadioOptions
                  title={'5. How long should the data to be kept (cloud-storage)'}
                  options={[
                      {text:"Short Period (6 months) ", value: 6}, 
                      {text:"Medium Period (12 months)", value: 12},
                      {text:"Long Period (24 months +)", value: 36}
                  ]}
                  value={this.state.retainingPeriod}
                  onChange={(retainingPeriod) => this.setState({retainingPeriod})}
                />
              <RadioOptions
                title={'6. Do you require local support and training?'}
                options={[
                    {text:"Yes", tooltip: 'Onsite team for training, maintenance and repair.', value: 1}, 
                    {text:"No", value: 0}
                ]}
                value={this.state.localSupport}
                onChange={(localSupport) => this.setState({localSupport})}
              />
          </div>
          <div className="column" ref={(receipt) => this.receipt = receipt}>
            {this.state.camera == '' ? <pre> Choose a camera </pre> : null}
            <div className={receipt}>
            {this.state.init ? 
              <small style={{marginBottom: '10px', background: '#EEE', padding: '5px', display: 'block'}}>We've pre-selected our recommended options.</small> : null }
            <br/>
            <dl>
              <dt>Hardware</dt>
              <dd>{this.state.cameraQuantity || 0} x Camera Cost <span className={priceStyle}>{formatter.format(totalCameraCost)}</span> </dd>
              <dd>Per Camera Cost <span className={priceStyle}>{formatter.format(cameraCost())}</span> </dd>
              <dd>Docking Stations Cost <span className={priceStyle}>{formatter.format(dockingStationCost)}</span></dd>
              <dd>Total Hardware Cost <span className={priceStyle}>{formatter.format(totalHardwareCost)}</span></dd>
            </dl>
            <dl>
              <dt>Storage Cost</dt>
              <dd>Maintenance Fee <span className={priceStyle}>{formatter.format(yearlyMaintenanceFeesPerCam)} / Camera / Year </span></dd>
            </dl>
            {this.state.localSupport == 1 ? 
              <dl>
                <dt>Support Cost</dt>
                <dd>Training/Support <span className={priceStyle}>{formatter.format(YEARLY_SERVICE_COST(this.state.cameraQuantity))}/Year</span></dd>
              </dl> : null 
            }
            <dl>
              <dt>Total Cost</dt>
              <dd>Fixed Costs <span className={priceStyle}>{formatter.format(totalHardwareCost)}</span></dd>
              <dd>Recurring Costs <span className={priceStyle}>{formatter.format(recurringCosts)}/Year</span></dd>
            </dl>
            <a className="button" href="mailto:hello@rhodium.io" style={{backgroundColor: 'rgb(26, 52, 69)', borderColor:'#C4D4E0'}}> Inquire more </a>
            <small style={{marginBottom: '10px', background: '#EEE', fontSize: '10px', padding: '5px', display: 'block'}}>These prices are subject to change based on further specified requirements</small>
            </div>
          </div>
        </div>
      </div>
      
      <footer style={{marginTop: '4em'}} className="container"> 
      <hr/>
        <div className="row">
          <div className="column">
             by <a href="http://rhodium.io" style={{fontWeight: 'bold', color: 'rgb(26, 52, 69)'}}>rhodium.io</a>
          </div>
        </div> 
       
      </footer>
      </Container>
      )
  }
}
