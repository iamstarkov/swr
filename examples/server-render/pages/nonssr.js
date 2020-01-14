import React from 'react';
import Link from 'next/link'
import idx from 'idx'
import fetcher from '../libs/fetcher'
import Nav from '../components/nav'
import Pokemon from '../components/pokemon'

import useSWR from 'swr'

const api = {
  list: () => 'https://pokeapi.co/api/v2/pokemon/',
  item: (pokemon) => `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
}

export default function Home() {
  const { data: list } = useSWR(api.list(), fetcher)
  const [selected, setSelected] = React.useState(idx(list, _ => _.results[0].name));
  const { data: item } = useSWR(api.item(selected), fetcher)
  
  if (!list || !list.results) return 'loading...';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Nav />
      <h2>no ssr, no issue</h2>
      <div>
        <label htmlFor="pokemon-select">Choose a pokemon:</label>
        <select name="pets" id="pet-select" defaultValue={selected} onChange={e => { setSelected(e.target.value); }}>
          {list.results.map(pokemon => (
            <option value={pokemon.name} key={pokemon.name}>
              {pokemon.name}
            </option>
          ))}
        </select>
        {selected ? <Pokemon item={item} /> : <></>}
      </div>
    </div>
  )
}

