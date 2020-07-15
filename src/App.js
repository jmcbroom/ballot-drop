import React, { useState } from 'react';
import DropOffMap from './DropOffMap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVoteYea } from '@fortawesome/free-solid-svg-icons'

const addressMessage = (address) => {
  const [addr, city, ...rest] = address.place_name.split(',')
  return <h2>Showing drop-off locations for <b>{addr}</b> in <b>{city}</b>.</h2>
}

const Location = ({ feature }) => {
  return (
    <section className="p-2 bg-blue-200 mb-2">
      <h3 className="text-xl font-semibold mb-1">{feature.properties["Location Name"]}</h3>
      <p>Address: <b>{feature.properties['Street Address']}</b></p>
      <p>Open Hours: <b>{feature.properties['Hours']}</b></p>
    </section>
  )
}

function App() {

  const [address, setAddress] = useState(null)
  const [filtered, setFiltered] = useState([])

  console.log(address)

  return (
    <div>
      <header className="flex content-between items-center px-3 bg-blue-200">
        <FontAwesomeIcon icon={faVoteYea} size="lg"/>
        <h1 className="text-lg font-bold m-2">MI-13 Absentee Ballot Drop-Off Locator</h1>
      </header>
      <DropOffMap setAddress={setAddress} address={address} setFiltered={setFiltered} />
      <section className="p-3 bg-blue-200 w-100 flex content-between justify-between align-middle items-center">
        {!address ?
          <h2 className="text-xl"><b>Enter your address</b> to look up your ballot drop-off location.</h2> :
          <>
            {addressMessage(address)}
            <button
              className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-2 border border-red-500 hover:border-transparent rounded"
              onClick={() => { setAddress(null); setFiltered([]) }}>
              Reset
            </button>
          </>}
      </section>
      {filtered.length > 0 &&
        <section className="p-3 bg-gray-200">
          <h2 className="text-xl mb-2">
            {filtered.length === 1 ? `Drop off your absentee ballot early at:` : `There are ${filtered.length} locations you can visit to drop off your ballot:`}
          </h2>
          {filtered.map(f => (
            <Location feature={f} />
          ))}

        </section>}
      <hr />
    </div>
  );
}

export default App;
