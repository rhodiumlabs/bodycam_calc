import React, {Component} from 'react'
import style from 'next/css';
import Container from './container';
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const IMPORT_TAX = 20;

//markup 40%
const options = {
  HARDWARE_UNIT_PRICE: 140,
  COST_3G: 140,
  COST_GPS: 14, 
  COST_BATTERY: 12,
  EXTRA_MEMORY: 15,
}
const DOCKING_STATIONS = {
  0: 0,
  1: 2000,
  2: 1500
}
const PER_GIGABIT_COST = 0.006;
export const bodyStyle = style({
    fontFamily: 'Work Sans',
    color: '#333',
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
    borderBottom: '1px dotted #9b4dca'
});

export const subHeader = style({
    fontSize: '1em',
    marginTop: '1em',
    color: '#9b4dca',
});

class RadioOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radiobox: 0,
      customValue: props.min,
      text: props.min
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, radiobox, value) {
    if(e.target.value) {
      this.setState({radiobox: radiobox});
      this.props.onChange(value);
    }
  }
  render() {
    return  <dl style={{margin: 0}}> 
              {this.props.options.map((op, i) => 
                <dt>
                  <label style={{fontSize: '0.9em'}}>
                    <input 
                      type="radio" 
                      checked={this.state.radiobox == i} 
                      onChange={(e) => this.onChange(e, i, op.value)}   
                    /> {op.text}
                  </label>
                </dt>
              )}
              {this.props.custom ? 
              <dt>
                <label style={{fontSize: '0.9em'}}>
                <input 
                  type="radio" 
                  checked={this.state.radiobox == this.props.options.length}
                  onChange={(e) => this.onChange(e, this.props.options.length, this.state.customValue)} 
                /> {this.props.customTitle} : 
                  <input 
                    type="number" 
                    value={this.state.text} 
                    disabled={this.state.radiobox !== this.props.options.length}
                    onBlur={(e) => {
                      if(isNaN(e.target.value) || 
                        e.target.value < this.props.min ||
                        (this.props.max && e.target.value > this.props.max)) {
                        this.setState({text: this.state.customValue});
                        return;
                      } 
                      this.setState({customValue: e.target.value});
                      this.props.onChange(e.target.value);
                    }}
                    onChange={(e) => {
                      this.setState({text: e.target.value});
                    }}
                    min={this.props.min} 
                    max={this.props.max}
                    style={{width: '150px', display: 'inline-block'}} /> <small> {this.props.customUnits} </small>
                </label>
              </dt> : null }
    </dl>
  }
}
const QuestionSection = (props) => 
            <div className="row" >
              <div className="column" style={{background: '#EEE', marginBottom: '1em', paddingLeft: '2em'}}>{props.children}</div>
              <div className="column">{props.tip ? <div style={{fontSize: '0.9em', margin: '1em', padding: '1em', borderLeft: '2px solid #CCC', background: 'rgb(247, 227, 207)'}}>{props.tip}</div> : null}</div>
            </div>

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      camera_type: 1,
      camera_qty: 100,
      extra_battery: false,
      extra_memory: false,
      docking: 0,
      daily_hours: 1,
      retaining_period: 1,
      options: {}
    }
  }
	render() {
    return <Container>
      <div className={`${bodyStyle} container`}>
        <div className="row">

          <div className="column"><h1>Body Cam Calculator</h1></div>
        </div>
        <hr/>
        <div className="row">
          <div className="column">
            
              <div className="row">
                <h5 className={headerUnder}>Hardware Options</h5>
              </div>
              <QuestionSection>
                  <div className="row">
                    <h5 className={subHeader}>Number of cameras</h5>
                  </div>
                  
                  <div className="row">
                  <RadioOptions
                    options={[
                        {text:"Pilot program (100 Units)", value: 100}, 
                        {text:"Mid-Level program (500 Units)", value: 500}, 
                        {text:"Full-scale program (1000 Units)", value: 1000}
                    ]}
                    custom={true}
                    customTitle="Custom Quantity"
                    customUnits="units"
                    min={1}
                    onChange={(val) => this.setState({camera_qty: val})}
                  />
                  </div>
              </QuestionSection>
              <QuestionSection>
                <div className="row">
                  <h5 className={subHeader}>Optional Features & Accessories</h5>
                </div>
                <div className="row">
                  <dl>  
                    <dt><label><input type="checkbox" id="cbox1" checked={this.state.option_1} onChange={() => this.setState({option_1: !this.state.option_1})}/> Extra battery (+8hours recording time)</label></dt>
                    <dt><label><input type="checkbox" id="cbox1" checked={this.state.option_2} onChange={() => this.setState({option_2: !this.state.option_2})}/> Extra memory (+16GB/8hours recording time)</label></dt>
                    <dt><label><input type="checkbox" id="cbox1" checked={this.state.option_4} onChange={() => this.setState({option_4: !this.state.option_4})}/> GPS Option </label></dt>
                    <dt><label><input type="checkbox" id="cbox1" checked={this.state.option_3} onChange={() => this.setState({option_3: !this.state.option_3})}/> 3G Option (for live streaming) </label></dt>
                  </dl>
                </div>
              </QuestionSection>
              <QuestionSection 
                tip={'The docking stations provide a central location for the cameras to be charged and data to be uploaded.'}>
                <div className="row">
                  <h5 className={subHeader}>Docking Stations</h5>
                </div>
                <div className="row">
                  <RadioOptions
                    options={[
                        {text:"None", value: 0},
                        {text:"DMT20 Docking Station [Onboard computer and storage]", value: 1}, 
                        {text:"DMT8A Docking Station [No onboard computer]", value: 2},
                    ]}
                    custom={false}
                    onChange={(val) => this.setState({docking: val})}
                  />
                </div>
              </QuestionSection>

                <div className="row">
                  <h5 className={headerUnder}>Maintenance & Storage Options</h5>
                </div>
              <QuestionSection>
                <div className="row">
                  <h5 className={subHeader}>How frequent are the police officers going to use the cameras</h5>
                </div>
                <div className="row">
                  <RadioOptions
                    options={[
                        {text:"Minimal-use (0.5-1h footage/day)", value: 1}, 
                        {text:"Moderate-use (1-3h footage/day)", value: 3},
                        {text:"Heavy-use (4h-8h footage/day)", value: 8}
                    ]}
                    customTitle="Custom Usage"
                    customUnits="hours/day"
                    custom={true}
                    min={8}
                    max={24}
                    onChange={(val) => this.setState({daily_hours: val})}
                  />
                </div>
              </QuestionSection>
              <QuestionSection>
                <div className="row">
                  <h5 className={subHeader}>How long should the data to be kept (cloud-storage)</h5>
                </div>
                <div className="row">
                <RadioOptions
                    options={[
                        {text:"Short Period (1-4 weeks) ", value: 1}, 
                        {text:"Medium Period (6-12 months)", value: 12},
                        {text:"Long Period (2 years)", value: 24}
                    ]}
                    customTitle="Custom Period"
                    customUnits="months"
                    custom={true}
                    min={0}
                    onChange={(val) => this.setState({retaining_period: val})}
                  />
                </div>
              </QuestionSection>
          </div>
          </div>
        
          <hr/>
        <div className="row">
          <div className="column"><h1>Hardware Cost</h1></div>
          
        </div>
        <div className="row">
          <table>

            <tbody>
            <tr>
              <th colSpan={4}>Camera Options</th>
              <th colSpan={1}>Total (USD)</th>
            </tr>
            <tr>
              <td colSpan={4} rowSpan={4}>
                <ul> 
                  <li key={'units'}>{this.state.camera_qty} camera units</li>
                  {this.state.option_1 ? <li key={'options1'}>Extra Battery [+{options.COST_BATTERY} USD]</li> : null }
                  {this.state.option_2 ? <li key={'options2'}>Extra Memory [+{options.COST_MEMORY} USD]</li> : null }
                  {this.state.option_3 ? <li key={'options3'}>3G [+{options.COST_3G} USD]</li> : null }
                  {this.state.option_4 ? <li key={'options4'}>GPS [+{options.COST_GPS} USD]</li> : null }
                  {this.state.docking == 2 ? 
                    <li key='dock1'>{this.state.camera_qty / 8} x Docking Station DMT8 [+{DOCKING_STATIONS[2]}USD/Unit ]</li> : null }
                  {this.state.docking == 1 ? 
                    <li key='dock2'>{this.state.camera_qty / 20} x Docking Station DMT20 [+{DOCKING_STATIONS[1]}USD/Unit ]</li> : null }
                </ul>
              </td>
              <td colSpan={1} key='cost'>{
                formatter.format((options.HARDWARE_UNIT_PRICE + 
                  (this.state.option_1 ? options.COST_BATTERY : 0) +
                  (this.state.option_2 ? options.COST_MEMORY : 0) +
                  (this.state.option_3 ? options.COST_3G : 0) +
                  (this.state.option_4 ? options.COST_GPS : 0) 
                  )  * this.state.camera_qty +
                  (this.state.docking == 1 ? DOCKING_STATIONS[1] * Math.ceil(this.state.camera_qty / 20) : 0) + 
                  (this.state.docking == 2 ? DOCKING_STATIONS[2] * Math.ceil(this.state.camera_qty / 8) : 0)
                )  

              } USD</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div className="row">
          <div className="column"><h1>Maintenance Cost</h1></div>
          
        </div>
        <div className="row">
          <table>
            <tbody>
            <tr>
              <th colSpan={4}>Cloud Storage Options</th>
              <th colSpan={1}>Total (USD)</th>
            </tr>
            <tr>
              <td colSpan={4} rowSpan={4}>
                <ul> 
                  <li>Required Storage for {this.state.daily_hours} hour(s) x {this.state.camera_qty} cameras</li>
                  <li>Videos are retained for {this.state.retaining_period} month(s)</li>
                  <li>Daily footage size: <b>{this.state.daily_hours * this.state.camera_qty * 8}</b> GB</li>
                  <li>Max footage size: <b>{this.state.daily_hours * this.state.camera_qty * 8 * this.state.retaining_period * 31}</b> GB</li>
                </ul>
              </td>
              <td colSpan={1} key='cost2'>
                <ul> 
                  <li>Software Cost: $2,500 USD </li>
                  <li>Monthly Storage Cost: {formatter.format(this.state.daily_hours * this.state.camera_qty * 8 * this.state.retaining_period * 31 * PER_GIGABIT_COST * 1.4)} USD/MONTH</li>
                  
                </ul>
                
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      </Container>
  }
}