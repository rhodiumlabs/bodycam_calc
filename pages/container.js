import React from 'react'
import Head from 'next/head'

export default class extends React.Component {
  render () {
    return <div>
      <Head>
        <title>BodyCam Cost Calculator</title>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.1.0/milligram.min.css" />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans|Work+Sans|Montserrat" rel="stylesheet" />
      </Head>
      <main className={"wrapper"}>
        {this.props.children}
      </main>
    </div>
  }
}

