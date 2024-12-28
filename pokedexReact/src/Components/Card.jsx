import { PokemonDescription } from './ComponentChildrens/PokemonDescription';
import { PokemonImage } from './ComponentChildrens/PokemonImage';
import { Loader } from './Loader';

export const Card = ({
	pokemonList,
	verifyTypeColor,
	activeOnchage,
	pokemonFilter,
	activeModal,
	pokemonFilterSearch,
	loading,
	toggleFavorite, // New prop
	favorites, // New prop
}) => {
	const arregloPokemonFilter = [...pokemonFilter];
	const arregloUnique = Array.from(
		new Set(arregloPokemonFilter.map(pokemon => pokemon.name))
	).map(name => arregloPokemonFilter.find(pokemon => pokemon.name === name));

	const handleModal = id => {
		activeModal(id);
	};

	const isFavorite = (pokemon) => favorites.some(fav => fav.id === pokemon.id);

	return (
		<>
			{loading ? (
				<Loader></Loader>
			) : activeOnchage === true ? (
				pokemonFilterSearch.map(el => (
					<div
						key={el.id}
						className='rounded-t-md border border-black shadow-customized2 relative'
					>
						<button
							onClick={() => handleModal(el.id)}
							className='w-full'
						>
							<PokemonImage el={el}></PokemonImage>
							<PokemonDescription
								el={el}
								verifyTypeColor={verifyTypeColor}
							></PokemonDescription>
						</button>
						<button
							onClick={() => toggleFavorite(el)}
							className={`absolute top-2 right-2 p-2 rounded-full ${
								isFavorite(el) ? 'bg-yellow-400' : 'bg-gray-200'
							}`}
							title={isFavorite(el) ? 'Remove from Favorites' : 'Add to Favorites'}
						>
							{isFavorite(el) ? '★' : '☆'}
						</button>
					</div>
				))
			) : arregloUnique.length > 0 ? (
				arregloUnique.map(el => (
					<div
						key={el.id}
						className='rounded-t-md border border-black shadow-customized2 relative'
					>
						<button
							onClick={() => handleModal(el.id)}
							className='w-full'
						>
							<PokemonImage el={el}></PokemonImage>
							<PokemonDescription
								el={el}
								verifyTypeColor={verifyTypeColor}
							></PokemonDescription>
						</button>
						<button
							onClick={() => toggleFavorite(el)}
							className={`absolute top-2 right-2 p-2 rounded-full ${
								isFavorite(el) ? 'bg-yellow-400' : 'bg-gray-200'
							}`}
							title={isFavorite(el) ? 'Remove from Favorites' : 'Add to Favorites'}
						>
							{isFavorite(el) ? '★' : '☆'}
						</button>
					</div>
				))
			) : (
				pokemonList.map(el => (
					<div
						key={el.id}
						className='rounded-t-md border border-black shadow-customized2 relative'
					>
						<button
							onClick={() => handleModal(el.id)}
							className='w-full'
						>
							<PokemonImage el={el}></PokemonImage>
							<PokemonDescription
								el={el}
								verifyTypeColor={verifyTypeColor}
							></PokemonDescription>
						</button>
						<button
							onClick={() => toggleFavorite(el)}
							className={`absolute top-2 right-2 p-2 rounded-full ${
								isFavorite(el) ? 'bg-yellow-400' : 'bg-gray-200'
							}`}
							title={isFavorite(el) ? 'Remove from Favorites' : 'Add to Favorites'}
						>
							{isFavorite(el) ? '★' : '☆'}
						</button>
					</div>
				))
			)}
		</>
	);
};
