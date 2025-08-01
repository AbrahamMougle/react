import { useState } from "react";
import debounce from "./debouncing";
interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  capital: string[];
  region: string;
  population: number;
  languages: {
    [key: string]: string; // Ex: { "fra": "French" }
  };
}
export default function App() {
  const [countries, setCountries] = useState<Country[]>([])
  let counter=0
  const loadData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value === '') {
      setCountries([])
      return
    }
    
    const response=await fetch(`https://restcountries.com/v3.1/name/${value}`)
    const res=await response.json()

    setCountries(res)
    console.log(res.length);
    
  

    }

const loadDataDebounced = debounce(loadData, 500); // Typage correctement préservé
  
    return (
  <div className="m-2">
    <input
      type="text"
      className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      placeholder="Rechercher un pays..."
      onChange={(e) => loadDataDebounced(e)}
    />

    {countries.length > 0 ? (
      <ul className="mt-4 space-y-2">
        {countries.map((item) => (
          <li 
            key={item.name.common} // ◀⚠️ Important : ajout d'une clé unique
            className="p-3 border-b border-gray-200 flex items-center gap-4"
          >
            {item.flags?.png && ( // ◀ Affichage conditionnel du drapeau
              <img 
                src={item.flags.png} 
                alt={`Drapeau ${item.name.common}`}
                className="w-8 h-auto"
              />
            )}
            <div>
              <p className="font-semibold">{item.name.common}</p>
              {item.capital && ( // ◀ Affichage conditionnel de la capitale
                <p className="text-sm text-gray-600">
                  Capitale : {item.capital.join(', ')}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-3 text-red-500 italic">
       {countries.length < 0  ? "Aucun pays trouvé" : "Commencez à taper un nom de pays"}
      </p>
    )}
  </div>
)
}