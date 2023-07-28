import { Suspense } from 'react'

import { PokemonList } from '@/components/pokemons'

export const runtime = 'edge'

export default function HomePage() {
    return (
        <Suspense fallback={'Loading...'}>
            <PokemonList />
        </Suspense>
    )
}
