import { useMemo, useState } from 'react';
import {
  ChefHat, Search, Heart, ShoppingBasket, House, BookOpen, Clock3,
  Plus, Minus, Check, ChevronLeft, ArrowRight, Utensils, Flame, X
} from 'lucide-react';

const recipes = [
  { id: 1, name: 'Risoto cremoso de cogumelos', category: 'Almoço', time: 35, level: 'Médio', kcal: 420, rating: '4.9', color: 'mushroom', emoji: '🍄',
    description: 'Um risoto aveludado, cheio de sabor e perfeito para uma refeição especial.',
    ingredients: ['1 xícara de arroz arbóreo', '200 g de cogumelos fatiados', '1/2 cebola picada', '700 ml de caldo de legumes', '2 colheres de manteiga', 'Parmesão a gosto'],
    steps: ['Aqueça o caldo de legumes em uma panela separada.', 'Refogue a cebola com uma colher de manteiga até ficar transparente.', 'Adicione os cogumelos e cozinhe por alguns minutos.', 'Acrescente o arroz e misture para envolver os grãos.', 'Adicione o caldo aos poucos, mexendo até o arroz ficar cremoso.', 'Finalize com manteiga e parmesão. Sirva imediatamente.'] },
  { id: 2, name: 'Panquecas americanas', category: 'Café da manhã', time: 20, level: 'Fácil', kcal: 310, rating: '4.8', color: 'pancake', emoji: '🥞',
    description: 'Panquecas fofinhas para começar o dia com um café da manhã especial.',
    ingredients: ['1 xícara de farinha de trigo', '1 ovo', '3/4 de xícara de leite', '2 colheres de açúcar', '1 colher de fermento', '1 pitada de sal'],
    steps: ['Misture a farinha, o açúcar, o fermento e o sal.', 'Adicione o ovo e o leite, mexendo até formar uma massa homogênea.', 'Aqueça uma frigideira antiaderente em fogo baixo.', 'Coloque pequenas porções da massa na frigideira.', 'Vire quando surgirem bolhas na superfície e doure o outro lado.', 'Sirva com frutas ou a cobertura de sua preferência.'] },
  { id: 3, name: 'Salada tropical colorida', category: 'Saladas', time: 15, level: 'Fácil', kcal: 185, rating: '4.7', color: 'salad', emoji: '🥗',
    description: 'Uma combinação refrescante de folhas, frutas e um molho cítrico.',
    ingredients: ['1 maço de folhas variadas', '1 manga em cubos', '10 tomates-cereja', '1/2 pepino', 'Suco de 1 limão', 'Azeite a gosto'],
    steps: ['Lave e seque bem as folhas.', 'Corte a manga, o pepino e os tomates.', 'Distribua as folhas em uma travessa.', 'Adicione as frutas e os vegetais.', 'Misture limão e azeite para preparar o molho.', 'Regue a salada e sirva.'] },
  { id: 4, name: 'Macarrão ao molho de tomate', category: 'Jantar', time: 25, level: 'Fácil', kcal: 390, rating: '4.9', color: 'pasta', emoji: '🍝',
    description: 'Um clássico prático com molho de tomate caseiro e manjericão.',
    ingredients: ['250 g de macarrão', '4 tomates maduros', '2 dentes de alho', '1/2 cebola', 'Azeite', 'Folhas de manjericão'],
    steps: ['Cozinhe o macarrão conforme as instruções da embalagem.', 'Refogue alho e cebola em um fio de azeite.', 'Adicione os tomates picados e cozinhe até desmancharem.', 'Tempere o molho e acrescente um pouco da água do cozimento.', 'Misture o macarrão ao molho.', 'Finalize com manjericão fresco.'] }
];

const categories = ['Todos', 'Café da manhã', 'Almoço', 'Jantar', 'Saladas'];
const starterItems = ['Arroz', 'Ovos', 'Leite', 'Tomate', 'Cebola'];

export default function App() {
  const [tab, setTab] = useState('Início');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState([]);
  const [groceries, setGroceries] = useState(starterItems);
  const [newItem, setNewItem] = useState('');
  const [step, setStep] = useState(0);

  const filtered = useMemo(() => recipes.filter(r =>
    (category === 'Todos' || r.category === category) &&
    r.name.toLowerCase().includes(query.toLowerCase())
  ), [category, query]);

  const toggleFavorite = id => setFavorites(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  const addIngredients = recipe => {
    setGroceries(old => [...new Set([...old, ...recipe.ingredients])]);
    setTab('Lista');
    setSelected(null);
  };
  const addGrocery = () => {
    if (newItem.trim()) { setGroceries(old => [...old, newItem.trim()]); setNewItem(''); }
  };

  const openRecipe = recipe => { setSelected(recipe); setStep(0); setChecked([]); };
  const go = name => { setSelected(null); setTab(name); };

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-icon"><ChefHat size={23}/></div><div><b>ChefSkill</b><small>COZINHE COM CRIATIVIDADE</small></div></div>
      <button className="avatar" aria-label="Perfil">GS</button>
    </header>

    {selected ? <main className="detail-page">
      <button className="back-button" onClick={() => setSelected(null)}><ChevronLeft size={18}/> Voltar às receitas</button>
      <div className={`detail-hero ${selected.color}`}><span>{selected.emoji}</span><div className="hero-tag">RECEITA CHEFSKILL</div></div>
      <div className="detail-heading"><div><span className="eyebrow">{selected.category}</span><h1>{selected.name}</h1><p>{selected.description}</p></div>
        <button className={`heart-button ${favorites.includes(selected.id) ? 'active' : ''}`} onClick={() => toggleFavorite(selected.id)}><Heart fill={favorites.includes(selected.id) ? 'currentColor' : 'none'}/></button></div>
      <div className="stats"><span><Clock3/> {selected.time} min</span><span><Flame/> {selected.kcal} kcal</span><span><Utensils/> {selected.level}</span></div>
      <section className="content-card"><div className="section-title"><div><span className="eyebrow">PREPARE TUDO</span><h2>Ingredientes</h2></div><span className="count">{selected.ingredients.length} itens</span></div>
        {selected.ingredients.map((item, i) => <label className="ingredient" key={i}><input type="checkbox" checked={checked.includes(i)} onChange={() => setChecked(old => old.includes(i) ? old.filter(x => x !== i) : [...old, i])}/><span>{item}</span></label>)}
        <button className="outline-action" onClick={() => addIngredients(selected)}><ShoppingBasket size={17}/> Adicionar à lista de mercado</button>
      </section>
      <section className="content-card"><div className="section-title"><div><span className="eyebrow">MÃO NA MASSA</span><h2>Modo de preparo</h2></div><span className="count">{step + 1}/{selected.steps.length}</span></div>
        <div className="progress"><span style={{width: `${((step + 1) / selected.steps.length) * 100}%`}}/></div>
        <div className="step-number">PASSO {String(step + 1).padStart(2, '0')}</div><p className="step-text">{selected.steps[step]}</p>
        <div className="step-actions"><button className="outline-action" disabled={step === 0} onClick={() => setStep(s => s - 1)}>Anterior</button><button className="primary-action" onClick={() => step === selected.steps.length - 1 ? setStep(0) : setStep(s => s + 1)}>{step === selected.steps.length - 1 ? 'Recomeçar' : 'Próximo passo'} <ArrowRight size={17}/></button></div>
      </section>
    </main> : <main>
      {tab === 'Início' && <>
        <section className="welcome"><div><span className="eyebrow light">SEU MOMENTO NA COZINHA</span><h1>Boas ideias,<br/><em>bons sabores.</em></h1><p>Descubra receitas e transforme ingredientes em momentos especiais.</p><button onClick={() => go('Receitas')}>Explorar receitas <ArrowRight size={17}/></button></div><div className="welcome-art">🥑<span>✦</span></div></section>
        <div className="section-title home-title"><div><span className="eyebrow">SELEÇÃO DO CHEF</span><h2>Receitas em destaque</h2></div><button className="text-button" onClick={() => go('Receitas')}>Ver todas <ArrowRight size={15}/></button></div>
        <div className="recipe-grid">{recipes.slice(0, 3).map(r => <RecipeCard key={r.id} recipe={r} favorite={favorites.includes(r.id)} onFavorite={toggleFavorite} onOpen={openRecipe}/>)}</div>
        <section className="tip-card"><div className="tip-icon">✦</div><div><b>Dica do Chef</b><p>Leia toda a receita antes de começar. Organização é o primeiro ingrediente de um bom prato!</p></div></section>
      </>}
      {tab === 'Receitas' && <>
        <div className="page-heading"><span className="eyebrow">EXPLORE E EXPERIMENTE</span><h1>Encontre sua próxima receita.</h1><p>Inspiração para todos os momentos.</p></div>
        <div className="searchbox"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar uma receita..."/>{query && <button onClick={() => setQuery('')}><X size={16}/></button>}</div>
        <div className="chips">{categories.map(c => <button key={c} className={category === c ? 'selected' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="recipe-grid">{filtered.map(r => <RecipeCard key={r.id} recipe={r} favorite={favorites.includes(r.id)} onFavorite={toggleFavorite} onOpen={openRecipe}/>)}</div>
        {!filtered.length && <div className="empty">Nenhuma receita encontrada. Tente outra busca.</div>}
      </>}
      {tab === 'Favoritos' && <>
        <div className="page-heading"><span className="eyebrow">SEUS PREFERIDOS</span><h1>Receitas favoritas.</h1><p>Seus pratos especiais sempre por perto.</p></div>
        <div className="recipe-grid">{recipes.filter(r => favorites.includes(r.id)).map(r => <RecipeCard key={r.id} recipe={r} favorite onFavorite={toggleFavorite} onOpen={openRecipe}/>)}</div>
        {!favorites.length && <div className="empty"><Heart size={28}/><b>Você ainda não tem favoritos</b><p>Toque no coração de uma receita para salvá-la aqui.</p><button className="primary-action" onClick={() => go('Receitas')}>Descobrir receitas</button></div>}
      </>}
      {tab === 'Lista' && <>
        <div className="page-heading"><span className="eyebrow">ORGANIZE SUAS COMPRAS</span><h1>Lista de mercado.</h1><p>Planeje suas compras sem esquecer nada.</p></div>
        <div className="add-item"><input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addGrocery()} placeholder="Adicionar ingrediente..."/><button onClick={addGrocery}><Plus size={20}/></button></div>
        <div className="content-card grocery-card"><div className="section-title"><h2>Minha lista</h2><span className="count">{groceries.length} itens</span></div>
          {groceries.map((item, i) => <div className="grocery-row" key={`${item}-${i}`}><label><input type="checkbox" checked={checked.includes(`g${i}`)} onChange={() => setChecked(old => old.includes(`g${i}`) ? old.filter(x => x !== `g${i}`) : [...old, `g${i}`])}/><span>{item}</span></label><button aria-label={`Remover ${item}`} onClick={() => setGroceries(old => old.filter((_, idx) => idx !== i))}><X size={17}/></button></div>)}
          {!groceries.length && <p className="muted">Sua lista está vazia. Adicione ingredientes acima.</p>}
          <button className="clear-button" onClick={() => {setGroceries([]); setChecked([])}}>Limpar lista</button>
        </div>
      </>}
    </main>}

    <nav className="bottom-nav">
      <NavItem icon={<House/>} label="Início" active={tab === 'Início' && !selected} onClick={() => go('Início')}/>
      <NavItem icon={<BookOpen/>} label="Receitas" active={tab === 'Receitas' || !!selected} onClick={() => go('Receitas')}/>
      <NavItem icon={<Heart/>} label="Favoritos" active={tab === 'Favoritos'} onClick={() => go('Favoritos')}/>
      <NavItem icon={<ShoppingBasket/>} label="Lista" active={tab === 'Lista'} onClick={() => go('Lista')}/>
    </nav>
  </div>;
}

function RecipeCard({ recipe, favorite, onFavorite, onOpen }) {
  return <article className="recipe-card">
    <button className={`food-art ${recipe.color}`} onClick={() => onOpen(recipe)} aria-label={`Abrir ${recipe.name}`}><span>{recipe.emoji}</span><small>{recipe.category}</small></button>
    <div className="recipe-info"><div className="recipe-meta"><span><Clock3 size={13}/> {recipe.time} min</span><span>★ {recipe.rating}</span></div>
      <div className="recipe-name-row"><button className="recipe-name" onClick={() => onOpen(recipe)}>{recipe.name}</button><button className={`mini-heart ${favorite ? 'active' : ''}`} onClick={() => onFavorite(recipe.id)} aria-label="Favoritar"><Heart size={18} fill={favorite ? 'currentColor' : 'none'}/></button></div>
      <span className="difficulty">{recipe.level}</span>
    </div>
  </article>;
}
function NavItem({ icon, label, active, onClick }) {
  return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span></button>;
}