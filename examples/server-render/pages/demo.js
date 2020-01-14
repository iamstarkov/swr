import React from 'react';
import Link from 'next/link'
import fetcher from '../libs/fetcher'
import Nav from '../components/nav'
import Pokemon from '../components/pokemon'

import useSWR from 'swr'

const api = {
  list: () => 'https://pokeapi.co/api/v2/pokemon/',
  item: (pokemon) => `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
}

export default function Home(props) {
  const { data: list } = useSWR(api.list(), fetcher, { initialData: props.list })
  const [selected, setSelected] = React.useState(list.results[0].name);
  const { data: item, revalidate } = useSWR(() => api.item(selected), fetcher, { initialData: props.item })

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Nav />
      <h2>Demo works with 0.1.15</h2>
      <div>
        <label htmlFor="pokemon-select">Choose a pokemon:</label>
        <select name="pets" id="pet-select" defaultValue={selected} onChange={e => { setSelected(e.target.value); }}>
          {list.results.map(pokemon => (
            <option value={pokemon.name} key={pokemon.name}>
              {pokemon.name}
            </option>
          ))}
        </select>
        <Pokemon item={item} revalidate={revalidate} />
      </div>
    </div>
  )
}

Home.getInitialProps = async () => {
  const list = await fetcher(api.list())
  const item = await fetcher(api.item(list.results[0].name))
  return { list, item }
}
