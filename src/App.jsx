
import { useMemo, useState, useEffect } from 'react';

import {
  ChefHat,
  Search,
  Heart,
  ShoppingBasket,
  House,
  BookOpen,
  Clock3,
  Plus,
  ChevronLeft,
  ArrowRight,
  Utensils,
  Flame,
  X
} from 'lucide-react';

const recipes = [
  // Suas quatro receitas
];

const categories = [
  'Todos',
  'Café da manhã',
  'Almoço',
  'Jantar',
  'Saladas'
];



  
const starterItems = [
  // Grãos e massas
  'Arroz',
  'Feijão',
  'Macarrão',
  'Farinha de trigo',
  'Farinha de mandioca',
  'Aveia',

  // Carnes e proteínas
  'Carne bovina',
  'Frango',
  'Peixe',
  'Carne moída',
  'Ovos',
  'Presunto',
  'Queijo',

  // Laticínios
  'Leite',
  'Manteiga',
  'Creme de leite',
  'Requeijão',
  'Iogurte',

  // Verduras e legumes
  'Tomate',
  'Cebola',
  'Alho',
  'Batata',
  'Cenoura',
  'Alface',
  'Brócolis',
  'Pimentão',

  // Frutas
  'Banana',
  'Maçã',
  'Laranja',
  'Morango',
  'Limão',

  // Temperos
  'Sal',
  'Açúcar',
  'Pimenta-do-reino',
  'Orégano',
  'Azeite',
  'Óleo',

  // Outros
  'Molho de tomate',
  'Fermento',
  'Chocolate em pó',
  'Mel'
];


function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function createId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function loadGroceries() {
  const saved = loadStorage('chefskill-groceries', null);

  if (!Array.isArray(saved)) {
    return starterItems.map(name => ({
      id: createId(),
      name,
      checked: false
    }));
  }

  // Compatibilidade com a versão anterior,
  // que armazenava os ingredientes como strings.
  return saved.map(item => {
    if (typeof item === 'string') {
      return { id: createId(), name: item, checked: false };
    }

    return {
      id: item.id || createId(),
      name: item.name || '',
      checked: Boolean(item.checked)
    };
  }).filter(item => item.name);
}

export default function App() {
  const [tab, setTab] = useState('Início');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');

  const [favorites, setFavorites] = useState(
    () => loadStorage('chefskill-favorites', [])
  );

  const [groceries, setGroceries] = useState(loadGroceries);

  const [selected, setSelected] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState('');

  // Persistência dos dados.
  useEffect(() => {
    try {
      localStorage.setItem(
        'chefskill-favorites',
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(
        'chefskill-groceries',
        JSON.stringify(groceries)
      );
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
    }
  }, [groceries]);

  // Pesquisa por nome, descrição, categoria e ingredientes.
  const filtered = useMemo(() => {
    const search = normalizeText(query);

    return recipes.filter(recipe => {
      const matchesCategory =
        category === 'Todos' || recipe.category === category;

      const searchableContent = normalizeText([
        recipe.name,
        recipe.description,
        recipe.category,
        ...recipe.ingredients
      ].join(' '));

      return matchesCategory &&
        searchableContent.includes(search);
    });
  }, [category, query]);

  const favoriteRecipes = useMemo(
    () => recipes.filter(recipe => favorites.includes(recipe.id)),
    [favorites]
  );

  const completedGroceries = groceries.filter(item => item.checked).length;

  // Favoritos.
  function toggleFavorite(id) {
    setFavorites(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    );
  }

  // Navegação.
  function go(name) {
    setSelected(null);
    setTab(name);
    setNotice('');
  }

  function openRecipe(recipe) {
    setSelected(recipe);
    setStep(0);
    setCheckedIngredients([]);
    setNotice('');
  }

  // Ingredientes da receita.
  function toggleIngredient(index) {
    setCheckedIngredients(current =>
      current.includes(index)
        ? current.filter(item => item !== index)
        : [...current, index]
    );
  }

  function addIngredients(recipe) {
    const additions = recipe.ingredients
      .filter(ingredient => {
        const exists = groceries.some(
          item => normalizeText(item.name) === normalizeText(ingredient)
        );

        return !exists;
      })
      .map(name => ({
        id: createId(),
        name,
        checked: false
      }));

    if (!additions.length) {
      setNotice('Os ingredientes desta receita já estão na sua lista.');
    } else {
      setGroceries(current => [...current, ...additions]);
      setNotice(`${additions.length} ingrediente(s) adicionado(s)!`);
    }

    setSelected(null);
    setTab('Lista');
  }

  // Lista de mercado.
  function addGrocery() {
    const name = newItem.trim();

    if (!name) return;

    const alreadyExists = groceries.some(
      item => normalizeText(item.name) === normalizeText(name)
    );

    if (alreadyExists) {
      setNotice('Esse item já está na sua lista.');
      return;
    }

    setGroceries(current => [
      ...current,
      { id: createId(), name, checked: false }
    ]);

    setNewItem('');
    setNotice('Item adicionado à lista!');
  }

  function toggleGrocery(id) {
    setGroceries(current =>
      current.map(item =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  }

  function removeGrocery(id) {
    setGroceries(current =>
      current.filter(item => item.id !== id)
    );
  }

  function clearGroceries() {
    setGroceries([]);
    setNotice('Lista de mercado limpa.');
  }

  function nextStep() {
    setStep(current =>
      current >= selected.steps.length - 1 ? 0 : current + 1
    );
  }

  return (
    <div className="app-shell">

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <ChefHat size={23} />
          </div>

          <div>
            <b>ChefSkill</b>
            <small>COZINHE COM CRIATIVIDADE</small>
          </div>
        </div>

        <button className="avatar" aria-label="Perfil ChefSkill">
          GS
        </button>
      </header>

      {selected ? (
        <main className="detail-page">

          <button
            className="back-button"
            onClick={() => setSelected(null)}
          >
            <ChevronLeft size={18} />
            Voltar às receitas
          </button>

          <div className={`detail-hero ${selected.color}`}>
            <span>{selected.emoji}</span>
            <div className="hero-tag">RECEITA CHEFSKILL</div>
          </div>

          <div className="detail-heading">
            <div>
              <span className="eyebrow">{selected.category}</span>
              <h1>{selected.name}</h1>
              <p>{selected.description}</p>
            </div>

            <button
              className={`heart-button ${
                favorites.includes(selected.id) ? 'active' : ''
              }`}
              onClick={() => toggleFavorite(selected.id)}
              aria-label="Alternar favorito"
              aria-pressed={favorites.includes(selected.id)}
            >
              <Heart
                fill={favorites.includes(selected.id)
                  ? 'currentColor'
                  : 'none'}
              />
            </button>
          </div>

          <div className="stats">
            <span><Clock3 /> {selected.time} min</span>
            <span><Flame /> {selected.kcal} kcal</span>
            <span><Utensils /> {selected.level}</span>
          </div>

          <section className="content-card">
            <div className="section-title">
              <div>
                <span className="eyebrow">PREPARE TUDO</span>
                <h2>Ingredientes</h2>
              </div>

              <span className="count">
                {selected.ingredients.length} itens
              </span>
            </div>

            {selected.ingredients.map((item, index) => (
              <label className="ingredient" key={`${selected.id}-${index}`}>
                <input
                  type="checkbox"
                  checked={checkedIngredients.includes(index)}
                  onChange={() => toggleIngredient(index)}
                />
                <span>{item}</span>
              </label>
            ))}

            <button
              className="outline-action"
              onClick={() => addIngredients(selected)}
            >
              <ShoppingBasket size={17} />
              Adicionar à lista de mercado
            </button>
          </section>

          <section className="content-card">
            <div className="section-title">
              <div>
                <span className="eyebrow">MÃO NA MASSA</span>
                <h2>Modo de preparo</h2>
              </div>

              <span className="count">
                {step + 1}/{selected.steps.length}
              </span>
            </div>

            <div
              className="progress"
              role="progressbar"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={selected.steps.length}
              aria-label="Progresso do preparo"
            >
              <span
                style={{
                  width: `${((step + 1) / selected.steps.length) * 100}%`
                }}
              />
            </div>

            <div className="step-number">
              PASSO {String(step + 1).padStart(2, '0')}
            </div>

            <p className="step-text">{selected.steps[step]}</p>

            <div className="step-actions">
              <button
                className="outline-action"
                disabled={step === 0}
                onClick={() => setStep(current => current - 1)}
              >
                Anterior
              </button>

              <button className="primary-action" onClick={nextStep}>
                {step === selected.steps.length - 1
                  ? 'Recomeçar'
                  : 'Próximo passo'}
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        </main>
      ) : (
        <main>

          {tab === 'Início' && (
            <>
              <section className="welcome">
                <div>
                  <span className="eyebrow light">
                    SEU MOMENTO NA COZINHA
                  </span>

                  <h1>
                    Boas ideias,
                    <br />
                    <em>bons sabores.</em>
                  </h1>

                  <p>
                    Descubra receitas e transforme ingredientes
                    em momentos especiais.
                  </p>

                  <button onClick={() => go('Receitas')}>
                    Explorar receitas
                    <ArrowRight size={17} />
                  </button>
                </div>

                <div className="welcome-art">
                  🥑
                  <span>✦</span>
                </div>
              </section>

              <div className="section-title home-title">
                <div>
                  <span className="eyebrow">SELEÇÃO DO CHEF</span>
                  <h2>Receitas em destaque</h2>
                </div>

                <button
                  className="text-button"
                  onClick={() => go('Receitas')}
                >
                  Ver todas <ArrowRight size={15} />
                </button>
              </div>

              <div className="recipe-grid">
                {recipes.slice(0, 3).map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    favorite={favorites.includes(recipe.id)}
                    onFavorite={toggleFavorite}
                    onOpen={openRecipe}
                  />
                ))}
              </div>

              <section className="tip-card">
                <div className="tip-icon">✦</div>
                <div>
                  <b>Dica do Chef</b>
                  <p>
                    Leia toda a receita antes de começar.
                    Organização é o primeiro ingrediente de um bom prato!
                  </p>
                </div>
              </section>
            </>
          )}

          {tab === 'Receitas' && (
            <>
              <div className="page-heading">
                <span className="eyebrow">EXPLORE E EXPERIMENTE</span>
                <h1>Encontre sua próxima receita.</h1>
                <p>Inspiração para todos os momentos.</p>
              </div>

              <div className="searchbox">
                <Search size={19} />

                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Buscar receita ou ingrediente..."
                  aria-label="Buscar receitas"
                />

                {query && (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="Limpar pesquisa"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="chips">
                {categories.map(item => (
                  <button
                    key={item}
                    className={category === item ? 'selected' : ''}
                    onClick={() => setCategory(item)}
                    aria-pressed={category === item}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="recipe-grid">
                {filtered.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    favorite={favorites.includes(recipe.id)}
                    onFavorite={toggleFavorite}
                    onOpen={openRecipe}
                  />
                ))}
              </div>

              {!filtered.length && (
                <div className="empty">
                  Nenhuma receita encontrada. Tente outra busca.
                </div>
              )}
            </>
          )}

          {tab === 'Favoritos' && (
            <>
              <div className="page-heading">
                <span className="eyebrow">SEUS PREFERIDOS</span>
                <h1>Receitas favoritas.</h1>
                <p>Seus pratos especiais sempre por perto.</p>
              </div>

              <div className="recipe-grid">
                {favoriteRecipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    favorite
                    onFavorite={toggleFavorite}
                    onOpen={openRecipe}
                  />
                ))}
              </div>

              {!favoriteRecipes.length && (
                <div className="empty">
                  <Heart size={28} />
                  <b>Você ainda não tem favoritos</b>
                  <p>
                    Toque no coração de uma receita para salvá-la aqui.
                  </p>
                  <button
                    className="primary-action"
                    onClick={() => go('Receitas')}
                  >
                    Descobrir receitas
                  </button>
                </div>
              )}
            </>
          )}

          {tab === 'Lista' && (
            <>
              <div className="page-heading">
                <span className="eyebrow">ORGANIZE SUAS COMPRAS</span>
                <h1>Lista de mercado.</h1>
                <p>Planeje suas compras sem esquecer nada.</p>
              </div>

              <div className="add-item">
                <input
                  value={newItem}
                  onChange={event => setNewItem(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'Enter') addGrocery();
                  }}
                  placeholder="Adicionar ingrediente..."
                  aria-label="Novo ingrediente"
                />

                <button
                  onClick={addGrocery}
                  aria-label="Adicionar ingrediente"
                >
                  <Plus size={20} />
                </button>
              </div>

              {notice && (
                <p className="notice" role="status">
                  {notice}
                </p>
              )}

              <div className="content-card grocery-card">
                <div className="section-title">
                  <h2>Minha lista</h2>

                  <span className="count">
                    {completedGroceries}/{groceries.length} concluídos
                  </span>
                </div>

                {groceries.map(item => (
                  <div className="grocery-row" key={item.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleGrocery(item.id)}
                      />

                      <span>{item.name}</span>
                    </label>

                    <button
                      aria-label={`Remover ${item.name}`}
                      onClick={() => removeGrocery(item.id)}
                    >
                      <X size={17} />
                    </button>
                  </div>
                ))}

                {!groceries.length && (
                  <p className="muted">
                    Sua lista está vazia. Adicione ingredientes acima.
                  </p>
                )}

                {!!groceries.length && (
                  <button
                    className="clear-button"
                    onClick={clearGroceries}
                  >
                    Limpar lista
                  </button>
                )}
              </div>
            </>
          )}

        </main>
      )}

      <nav className="bottom-nav" aria-label="Navegação principal">
        <NavItem
          icon={<House />}
          label="Início"
          active={tab === 'Início' && !selected}
          onClick={() => go('Início')}
        />

        <NavItem
          icon={<BookOpen />}
          label="Receitas"
          active={tab === 'Receitas' || !!selected}
          onClick={() => go('Receitas')}
        />

        <NavItem
          icon={<Heart />}
          label="Favoritos"
          active={tab === 'Favoritos'}
          onClick={() => go('Favoritos')}
        />

        <NavItem
          icon={<ShoppingBasket />}
          label="Lista"
          active={tab === 'Lista'}
          onClick={() => go('Lista')}
        />
      </nav>
    </div>
  );
}

function RecipeCard({ recipe, favorite, onFavorite, onOpen }) {
  return (
    <article className="recipe-card">
      <button
        className={`food-art ${recipe.color}`}
        onClick={() => onOpen(recipe)}
        aria-label={`Abrir receita ${recipe.name}`}
      >
        <span>{recipe.emoji}</span>
        <small>{recipe.category}</small>
      </button>

      <div className="recipe-info">
        <div className="recipe-meta">
          <span><Clock3 size={13} /> {recipe.time} min</span>
          <span aria-label={`Avaliação ${recipe.rating}`}>
            ★ {recipe.rating}
          </span>
        </div>

        <div className="recipe-name-row">
          <button
            className="recipe-name"
            onClick={() => onOpen(recipe)}
          >
            {recipe.name}
          </button>

          <button
            className={`mini-heart ${favorite ? 'active' : ''}`}
            onClick={() => onFavorite(recipe.id)}
            aria-label={
              favorite
                ? `Remover ${recipe.name} dos favoritos`
                : `Adicionar ${recipe.name} aos favoritos`
            }
            aria-pressed={favorite}
          >
            <Heart
              size={18}
              fill={favorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <span className="difficulty">{recipe.level}</span>
      </div>
    </article>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      className={`nav-item ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
