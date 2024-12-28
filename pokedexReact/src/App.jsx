import { useEffect, useRef, useState } from 'react';
import { animateScroll as scroll } from 'react-scroll';
import './App.css';
import { Card } from './Components/Card';
import { Header } from './Components/Header';
import { Filter } from './Components/Icons/Filter';
import { Modal } from './Components/Modal';
import { useGetAllThePokemons } from './Hooks/useGetAllThePokemons';
import { useGetFiftyPokemons } from './Hooks/useGetFiftyPokemons.js';
import { useGetMenu } from './Hooks/useGetMenu';
import { capitalizeFirstLetter } from './Utils/constans.js';
import { verifyTypeColor } from './Utils/verifyTypeColor';

function App() {
    const [offset, setOffSet] = useState(0);
    const [loading, setLoading] = useState(true);
    const [stateModal, setStateModal] = useState(false);
    const [activeOnchage, setActiveOnchage] = useState(false);
    const modalRef = useRef(null);
    const [favorites, setFavorites] = useState([]);
    const { pokemonList } = useGetFiftyPokemons({ offset, setLoading });
    const { allPokemonList } = useGetAllThePokemons({ setLoading });
    const { handleClickMenu, ClosedMenu, verifyStatusMenu } = useGetMenu();
    const [pokemonFilter, setPokemonFilter] = useState([]);
    const [pokemonFilterSearch, setPokemonFilterSearch] = useState([]);
    const [dataModalPokemon, setDataModalPokemon] = useState([]);
    const [user, setUser] = useState(null);

    // Load favorites from localStorage when the app starts
    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            try {
                const parsedFavorites = JSON.parse(storedFavorites);
                if (Array.isArray(parsedFavorites)) {
                    setFavorites(parsedFavorites);
                }
            } catch (error) {
                console.error('Error parsing favorites from localStorage:', error);
            }
        }
    }, []);

    // Save favorites to localStorage whenever it changes
    useEffect(() => {
        try {
            if (favorites.length > 0) {
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
        }
    }, [favorites]);

    // Effects for handling outside click to close the modal
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current?.parentNode === event.target) {
                setStateModal(false);
            }
        };
        document.body.addEventListener('click', handleOutsideClick);

        return () => {
            document.body.removeEventListener('click', handleOutsideClick);
        };
    }, [stateModal]);

    const handleClickMorePokemons = () => setOffSet(offset + 50);

    const toggleFavorite = (pokemon) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.find((fav) => fav.id === pokemon.id)) {
                return prevFavorites.filter((fav) => fav.id !== pokemon.id);
            }
            return [...prevFavorites, pokemon];
        });
    };

    const activeModal = (id) => {
        const dataPokemon = allPokemonList.find((pokemon) => pokemon.id === id);
        if (dataPokemon) {
            setStateModal(true);
            setDataModalPokemon(dataPokemon);
        }
    };

    const handleLoginSuccess = (response) => {
        console.log('Login Success:', response);
        // Send the token to your backend to authenticate and get the user data
        fetch('http://localhost:5000/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: response.credential }),
        })
        .then((res) => res.json())
        .then((data) => {
            setUser(data);
        });
    };

    const handleLoginFailure = (error) => {
        console.error('Login Failed:', error);
    };

    const search = (namePokemon) => {
        if (!namePokemon.trim()) {
            setPokemonFilterSearch([]);
            setActiveOnchage(false);
            return;
        }
        setActiveOnchage(true);
        const filterForName = allPokemonList.filter((pokemon) =>
            pokemon.species.name.toLowerCase().includes(namePokemon.toLowerCase())
        );
        setPokemonFilterSearch([...filterForName]);
    };

    const handleUpAll = () => scroll.scrollToTop();

    return (
        <>
            <Modal
                ClosedModal={() => setStateModal(false)}
                ref={modalRef}
                capitalizeFirstLetter={capitalizeFirstLetter}
                verifyTypeColor={verifyTypeColor}
                stateModal={stateModal}
                dataModalPokemon={dataModalPokemon}
                modalClass={stateModal ? 'modalOut' : 'modalIn'}  // Apply transition class
            />
            <Header
                ClosedMenu={ClosedMenu}
                arregloPokemonFilter={() => {}}
                verifyStatusMenu={verifyStatusMenu}
                search={search}
            />
            <section className="m-customized2 flex w-[90%] max-w-[1000px] flex-col justify-center gap-4 md:m-auto">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* Search and Filter Section */}
                    <div className="flex-grow">
                        <button onClick={handleClickMenu} className="flex gap-3">
                            <Filter />
                            <span className="text-xl font-semibold">Filter</span>
                        </button>
                        {pokemonFilterSearch.length > 0 && (
                            <section className="flex mt-4">
                                <div className="text-xl font-bold">
                                    {`Found ${pokemonFilterSearch.length} results`}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Favorites Section moved further right */}
                    <section className="favorites-section w-[25%] max-w-[300px] p-4 bg-gray-100 rounded-lg shadow ml-auto">
                        <h2 className="text-xl font-bold">Favorites</h2>
                        <div className="grid gap-4">
                            {favorites.length === 0 ? (
                                <p>No favorites yet.</p>
                            ) : (
                                favorites.map((pokemon) => (
                                    <div key={pokemon.id} className="pokemon-card border p-2 rounded-lg">
                                        <h3>{pokemon.name}</h3>
                                        <button onClick={() => toggleFavorite(pokemon)}>★</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </section>
            <main className="m-customized2 w-[90%] md:max-w-[1000px]">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    <Card
                        loading={loading}
                        activeModal={activeModal}
                        verifyTypeColor={verifyTypeColor}
                        activeOnchage={activeOnchage}
                        pokemonList={pokemonList}
                        pokemonFilter={pokemonFilter}
                        pokemonFilterSearch={pokemonFilterSearch}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                    />
                </div>
                {!loading && !activeOnchage && (
                    <div className="my-4 flex justify-center">
                        <button
                            onClick={handleClickMorePokemons}
                            className="rounded-md border-2 border-black bg-customized px-9 py-2"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </main>
            <div className="fixed bottom-12 right-10">
                <button title="Up" onClick={handleUpAll} className="rounded-full">
                    ↑
                </button>
            </div>
        </>
    );
}

export default App;

