
import React, { useState, useEffect, useRef } from 'react';

// --- Type Definitions ---
interface Livraison {
  id: number;
  quantite: string;
  designation: string;
  fob: string;
}

interface PrixUnitaire {
  id: number;
  designation: string;
  qte: string;
  fob: string;
  cfa: string;
  tage: string;
  prixRevient: string;
}

interface Reglement {
  id: number;
  date: string;
  reference: string;
  modePaiement: string;
  banque: string;
  montantDevise: string;
  devise: string;
  coursDevise: string;
  montantCFA: string;
  montantTPS: string;
  fraisBancaires: string;
}

// --- Placeholder Icons ---
const icons = {
  add: '💾',
  reglements: '🍯',
  costs: '💹',
  commissions: '💵',
  declarations: '📄',
  d3: '📑',
  monthly: '🗓️',
  orders: '🚚',
  oldCosts: '➡️',
  close: '❌',
  dossiers: '📁',
  stats: '📊',
  params: '⚙️',
};

// ============================================================================
// --- 1. LOGIN PAGE COMPONENT ---
// ============================================================================
const LoginPage: React.FC<{ onLogin: (user: string, pass: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Nom utilisateur
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Se connecter
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// --- 2. FORM PAGE COMPONENT (The main app we built) ---
// ============================================================================
const FormHeader: React.FC<{ onNavigateBack: () => void }> = ({ onNavigateBack }) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const traitementsMenu = [
        { icon: '📜', label: 'Etat des règlements' },
        { icon: '💹', label: 'Etat des coûts de revient' },
        { icon: '💵', label: 'Etat des commissions bancaires' },
        { icon: '📄', label: 'Etat des déclarations' },
        { icon: '📑', label: 'Etat des D3' },
        { icon: '🗓️', label: 'Etat des déclarations mensuelles' },
        { icon: '🚚', label: 'Etat des commandes' },
        { icon: '➡️', label: 'Etat des coûts de revient - anciens dossiers', highlighted: true },
        { isSeparator: true },
        { icon: '🌎', label: 'Statistique nombre de conteneurs par pays et par produit' },
        { icon: '🏢', label: 'Statistique nombre de conteneurs par armateur' },
        { icon: '清单', label: 'Etat liste de conteneurs avec numéro et date BL' },
        { icon: '🔄', label: 'Statistique des dossiers par transitaires' },
        { isSeparator: true },
        { label: 'Archivage des fichiers de dossiers' },
        { label: 'Suppression de dossiers obselètes' },
    ];

    const parametresMenu = [
        { icon: '👤', label: 'Ajouter utilisateur' },
        { icon: '⚓', label: 'Ajouter armateur' },
        { icon: '🌍', label: 'Ajouter origine' },
        { icon: '🎓', label: 'Ajouter type dossier' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderMenu = (items: typeof traitementsMenu) => (
        <div className="absolute top-full left-0 bg-white shadow-lg rounded mt-1 py-1 w-max border z-10">
            {items.map((item, index) =>
                item.isSeparator ? (
                    <hr key={index} className="my-1" />
                ) : (
                    <a
                        key={index}
                        href="#"
                        className={`block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 flex items-center whitespace-nowrap ${item.highlighted ? 'bg-green-300' : ''}`}
                    >
                        <span className="mr-3 w-4 text-center">{item.icon}</span>
                        <span>{item.label}</span>
                    </a>
                )
            )}
        </div>
    );
    
    return (
        <header className="bg-gray-200 border-b flex-shrink-0" ref={menuRef}>
            <nav className="flex justify-between items-center">
                <div className="flex">
                    <div className="relative">
                        <button
                            onClick={() => setOpenMenu(openMenu === 'Traitements' ? null : 'Traitements')}
                            className={`px-4 py-2 text-sm ${openMenu === 'Traitements' ? 'bg-white' : ''}`}
                        >
                            Traitements
                        </button>
                        {openMenu === 'Traitements' && renderMenu(traitementsMenu)}
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setOpenMenu(openMenu === 'Paramètres' ? null : 'Paramètres')}
                            className={`px-4 py-2 text-sm ${openMenu === 'Paramètres' ? 'bg-white' : ''}`}
                        >
                            Paramètres
                        </button>
                        {openMenu === 'Paramètres' && renderMenu(parametresMenu)}
                    </div>
                </div>
                <button
                    onClick={onNavigateBack}
                    className="flex items-center text-sm px-4 py-2 hover:bg-gray-300 rounded-md mx-2"
                    aria-label="Retour à l'accueil"
                >
                    <span className="mr-2" aria-hidden="true">{icons.close}</span>
                    Retour
                </button>
            </nav>
        </header>
    );
};

const FormPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    // --- States ---
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [newLivraison, setNewLivraison] = useState<Partial<Livraison>>({ quantite: '', designation: '', fob: '' });
  const [selectedLivraisonId, setSelectedLivraisonId] = useState<number | null>(null);

  const [prixUnitaires, setPrixUnitaires] = useState<PrixUnitaire[]>([]);
  const [newPrixUnitaire, setNewPrixUnitaire] = useState<Partial<PrixUnitaire>>({ designation: '', qte: '', fob: '', cfa: '', tage: '', prixRevient: '' });
  const [selectedPrixUnitaireId, setSelectedPrixUnitaireId] = useState<number | null>(null);

  const [reglements, setReglements] = useState<Reglement[]>([]);
  const [newReglement, setNewReglement] = useState<Partial<Reglement>>({ date: '', reference: '', modePaiement: '', banque: '', montantDevise: '', devise: '', coursDevise: '', montantCFA: '', montantTPS: '', fraisBancaires: '' });
  const [selectedReglementId, setSelectedReglementId] = useState<number | null>(null);

  // --- Handlers ---
  const handleNewLivraisonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLivraison(prev => ({ ...prev, [name]: value }));
  };

  const handleNewPrixUnitaireChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPrixUnitaire(prev => ({ ...prev, [name]: value }));
  };

  const handleNewReglementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewReglement(prev => ({ ...prev, [name]: value }));
  };

  const handleLivraisonKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedLivraisonId !== null) {
        setLivraisons(prev => prev.map(item => item.id === selectedLivraisonId ? { ...item, ...newLivraison, id: item.id } as Livraison : item));
      } else {
        setLivraisons(prev => [...prev, { ...newLivraison, id: Date.now() } as Livraison]);
      }
      setNewLivraison({ quantite: '', designation: '', fob: '' });
      setSelectedLivraisonId(null);
    }
  };

  const handlePrixUnitaireKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedPrixUnitaireId !== null) {
        setPrixUnitaires(prev => prev.map(item => item.id === selectedPrixUnitaireId ? { ...item, ...newPrixUnitaire, id: item.id } as PrixUnitaire : item));
      } else {
        setPrixUnitaires(prev => [...prev, { ...newPrixUnitaire, id: Date.now() } as PrixUnitaire]);
      }
      setNewPrixUnitaire({ designation: '', qte: '', fob: '', cfa: '', tage: '', prixRevient: '' });
      setSelectedPrixUnitaireId(null);
    }
  };

    const handleReglementKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedReglementId !== null) {
                setReglements(prev => prev.map(item => item.id === selectedReglementId ? { ...item, ...newReglement, id: item.id } as Reglement : item));
            } else {
                setReglements(prev => [...prev, { ...newReglement, id: Date.now() } as Reglement]);
            }
            setNewReglement({ date: '', reference: '', modePaiement: '', banque: '', montantDevise: '', devise: '', coursDevise: '', montantCFA: '', montantTPS: '', fraisBancaires: '' });
            setSelectedReglementId(null);
        }
    };

  const selectLivraison = (livraison: Livraison) => {
    setSelectedLivraisonId(livraison.id);
    setNewLivraison(livraison);
  };

  const selectPrixUnitaire = (prix: PrixUnitaire) => {
    setSelectedPrixUnitaireId(prix.id);
    setNewPrixUnitaire(prix);
  };

  const selectReglement = (reglement: Reglement) => {
      setSelectedReglementId(reglement.id);
      setNewReglement(reglement);
  };

    // --- Helper Components for Form Page ---
    const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
        <div className={`bg-[#e0e7ff] p-0.5 ${className}`}>
            <h2 className="bg-lime-300 text-black font-bold px-1 py-0 text-xs">{title}</h2>
            <div className="p-1 h-full flex flex-col">{children}</div>
        </div>
    );
    const FormGroup: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`flex items-center space-x-1 ${className}`}>{children}</div>
    );
    const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, ...props }) => (
    <>
        {label && <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">{label}</label>}
        <input className="bg-white border border-gray-400 text-xs p-px h-5 w-full" {...props} />
    </>
    );
    const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, options: string[] }> = ({ label, options, ...props }) => (
        <>
        {label && <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">{label}</label>}
        <select className="bg-white border border-gray-400 text-xs p-px h-5 w-full" {...props}>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        </>
    );
    const AdminDetailGroup: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-[#e0e7ff] p-px">
        <h3 className="text-xs font-bold">{title}</h3>
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-1 gap-y-0 text-xs p-px">
            <label className="font-semibold text-gray-700 whitespace-nowrap justify-self-end">Nom :</label>
            <input className="bg-white border border-gray-400 p-px h-5 w-full max-w-24" />
            
            <label className="font-semibold text-gray-700 whitespace-nowrap justify-self-end">N° Facture :</label>
            <input className="bg-white border border-gray-400 p-px h-5 w-full max-w-24" />

            <label className="font-semibold text-gray-700 whitespace-nowrap justify-self-end">Date :</label>
            <input className="bg-white border border-gray-400 p-px h-5 w-full max-w-24" />

            <label className="font-semibold text-gray-700 whitespace-nowrap justify-self-end">N° C.C :</label>
            <input className="bg-white border border-gray-400 p-px h-5 w-full max-w-24" />

            <label className="font-semibold text-gray-700 whitespace-nowrap justify-self-end">Montant :</label>
            <input className="bg-white border border-gray-400 p-px h-5 w-full max-w-24" />

            <label className="font-semibold text-gray-700 whitespace-nowrap justify-self-end">Mt taxable :</label>
            <input className="bg-white border border-gray-400 p-px h-5 w-full max-w-24" />

            <label className="font-semibold text-gray-700 whitespace-nowrap justify-self-end">Mt T.V.A :</label>
            <input className="bg-white border border-gray-400 p-px h-5 w-full max-w-24" />
        </div>
    </div>
    );

    return (
        <div className="h-screen flex flex-col font-sans bg-[#6b7db3]">
            <FormHeader onNavigateBack={() => onNavigate('home')} />
            <div className="flex-grow p-2 min-h-0">
                <div className="h-full grid grid-cols-12 grid-rows-[4fr_1fr] gap-2">
                    {/* Col 1 */}
                    <div className="col-span-2 row-start-1 row-span-2 flex flex-col gap-2 min-h-0">
                        <Section title="Recherche" className="flex-shrink-0">
                        <div className="space-y-2">
                            <FormGroup><input type="checkbox" id="numTEU" /><label htmlFor="numTEU" className="ml-2 text-sm">Numéro TEU</label></FormGroup>
                            <FormGroup><input type="checkbox" id="remiseDocs" /><label htmlFor="remiseDocs" className="ml-2 text-sm">Remise documents</label></FormGroup>
                        </div>
                        </Section>
                        <div className="bg-[#e0e7ff] flex-grow p-1 flex flex-col min-h-0">
                        <div className="border-2 border-gray-400 h-full overflow-y-auto overflow-x-auto">
                            <table className="w-full text-xs text-left">
                            <thead className="bg-gray-200 sticky top-0">
                                <tr>
                                    <th className="p-1 border-r whitespace-nowrap">N° doss...</th>
                                    <th className="p-1 border-r whitespace-nowrap">Origine</th>
                                    <th className="p-1 border-r whitespace-nowrap">Désignation</th>
                                    <th className="p-1 border-r whitespace-nowrap">N° FRI</th>
                                    <th className="p-1 border-r whitespace-nowrap">N° BSC</th>
                                    <th className="p-1 border-r whitespace-nowrap">Mt BSC</th>
                                    <th className="p-1 border-r whitespace-nowrap">Vendeur</th>
                                    <th className="p-1 border-r whitespace-nowrap">N° BL</th>
                                    <th className="p-1 border-r whitespace-nowrap">Navire</th>
                                    <th className="p-1 border-r whitespace-nowrap">Quantité</th>
                                    <th className="p-1 border-r whitespace-nowrap">Nbre T.E.U</th>
                                    <th className="p-1 border-r whitespace-nowrap">Mt devise</th>
                                    <th className="p-1 border-r whitespace-nowrap">Cours dev</th>
                                    <th className="p-1 border-r whitespace-nowrap">Mt CFA</th>
                                    <th className="p-1 border-r whitespace-nowrap">N° Déclaration</th>
                                    <th className="p-1 border-r whitespace-nowrap">N° Fa...</th>
                                    <th className="p-1 border-r whitespace-nowrap">N° A...</th>
                                    <th className="p-1 border-r whitespace-nowrap">Type dossier</th>
                                    <th className="p-1 whitespace-nowrap">N° Dossier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(20)].map((_, i) => (
                                    <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-yellow-200`}>
                                        <td className="p-1 border-r text-red-500 font-bold whitespace-nowrap">202100...</td>
                                        <td className="p-1 border-r whitespace-nowrap">VIET N...</td>
                                        <td className="p-1 border-r whitespace-nowrap">5X20X 5,000</td>
                                        <td className="p-1 border-r whitespace-nowrap">FRI-123</td>
                                        <td className="p-1 border-r whitespace-nowrap">BSC-456</td>
                                        <td className="p-1 border-r whitespace-nowrap">1500.00</td>
                                        <td className="p-1 border-r whitespace-nowrap">Vendor Name</td>
                                        <td className="p-1 border-r whitespace-nowrap">BL-789</td>
                                        <td className="p-1 border-r whitespace-nowrap">Ship Name</td>
                                        <td className="p-1 border-r whitespace-nowrap">1000</td>
                                        <td className="p-1 border-r whitespace-nowrap">2</td>
                                        <td className="p-1 border-r whitespace-nowrap">50000.00</td>
                                        <td className="p-1 border-r whitespace-nowrap">1.1</td>
                                        <td className="p-1 border-r whitespace-nowrap">55000.00</td>
                                        <td className="p-1 border-r whitespace-nowrap">DEC-001</td>
                                        <td className="p-1 border-r whitespace-nowrap">FA-002</td>
                                        <td className="p-1 border-r whitespace-nowrap">A-003</td>
                                        <td className="p-1 border-r whitespace-nowrap">Type A</td>
                                        <td className="p-1 whitespace-nowrap">DOSS-12345</td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                        <Section title="T.E.U" className="flex-shrink-0">
                        <FormSelect options={['Numéro T.E.U']} />
                        </Section>
                    </div>

                    {/* Col 2 */}
                    <div className="col-span-7 row-start-1 flex flex-col gap-2 min-h-0">
                        <Section title="Dossier livraisons" className="flex-shrink-0">
                            <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                                <FormGroup className="col-span-2"><FormInput label="Dossier :" /></FormGroup>
                                <FormGroup className="col-span-2"><FormSelect label="Origine :" options={['ALLEMAGNE', 'FRANCE', 'USA']} /></FormGroup>
                                <FormGroup className="col-span-2"><FormInput label="N° F.R.I :" /></FormGroup>
                                <FormGroup className="col-span-2"><FormInput label="N° B.S.C :" /></FormGroup>
                                <FormGroup className="col-span-2"><FormInput label="Montant B.S.C :" /></FormGroup>
                                <FormGroup className="col-span-2"><FormSelect label="Type :" options={['D3', 'D6', 'D15']} /></FormGroup>
                                <FormGroup className="col-span-4"><FormInput label="Vendeur :" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Qté :" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Nbre T.E.U :" /></FormGroup>
                            </div>
                        </Section>
                        
                        <div className="flex-grow grid grid-rows-2 gap-2 min-h-0">
                            <div className="bg-[#e0e7ff] p-1 flex flex-col min-h-0">
                                <div className="overflow-y-auto flex-grow">
                                    <table className="w-full text-sm text-center border-collapse">
                                        <thead className="sticky top-0">
                                            <tr className="bg-white">
                                                <th className="border p-1 w-1/4">Quantité</th>
                                                <th className="border p-1 w-2/4">Designation</th>
                                                <th className="border p-1 w-1/4">FOB (Montant)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {livraisons.map((livraison) => (
                                                <tr key={livraison.id} onClick={() => selectLivraison(livraison)} className={`cursor-pointer ${selectedLivraisonId === livraison.id ? 'ring-2 ring-blue-500' : ''}`}>
                                                    <td className="border p-0"><input type="text" readOnly value={livraison.quantite} className="w-full bg-red-600 text-black p-1 text-center border-0" /></td>
                                                    <td className="border p-0"><input type="text" readOnly value={livraison.designation} className="w-full bg-red-600 text-black p-1 text-center border-0" /></td>
                                                    <td className="border p-0"><input type="text" readOnly value={livraison.fob} className="w-full bg-red-600 text-black p-1 text-center border-0" /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex-shrink-0 mt-1">
                                    <table className="w-full text-sm text-center border-collapse">
                                        <tbody>
                                            <tr>
                                                <td className="p-0 border w-1/4"><input type="text" name="quantite" value={newLivraison.quantite || ''} onChange={handleNewLivraisonChange} onKeyDown={handleLivraisonKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Quantité" /></td>
                                                <td className="p-0 border w-2/4"><input type="text" name="designation" value={newLivraison.designation || ''} onChange={handleNewLivraisonChange} onKeyDown={handleLivraisonKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Designation" /></td>
                                                <td className="p-0 border w-1/4"><input type="text" name="fob" value={newLivraison.fob || ''} onChange={handleNewLivraisonChange} onKeyDown={handleLivraisonKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="FOB (Montant)" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex flex-col min-h-0">
                                <Section title="Calcul prix unitaire" className="h-full flex flex-col min-h-0">
                                    <div className="overflow-y-auto flex-grow">
                                        <table className="w-full text-sm text-center border-collapse">
                                                <thead className="sticky top-0">
                                                    <tr className="bg-white">
                                                        <th className="border p-1">Désignation</th>
                                                        <th className="border p-1">Qté</th>
                                                        <th className="border p-1">FOB (Montant)</th>
                                                        <th className="border p-1">CFA (Montant)</th>
                                                        <th className="border p-1">%tage</th>
                                                        <th className="border p-1">Prix revient</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {prixUnitaires.map(prix => (
                                                        <tr key={prix.id} onClick={() => selectPrixUnitaire(prix)} className={`cursor-pointer ${selectedPrixUnitaireId === prix.id ? 'ring-2 ring-blue-500' : ''}`}>
                                                            <td className="p-0 border"><input type="text" readOnly value={prix.designation} className="w-full bg-red-600 text-black p-1 text-center border-0" /></td>
                                                            <td className="p-0 border"><input type="text" readOnly value={prix.qte} className="w-full bg-red-600 text-black p-1 text-center border-0" /></td>
                                                            <td className="p-0 border"><input type="text" readOnly value={prix.fob} className="w-full bg-red-600 text-black p-1 text-center border-0" /></td>
                                                            <td className="p-0 border"><input type="text" readOnly value={prix.cfa} className="w-full bg-red-600 text-black p-1 text-center border-0" /></td>
                                                            <td className="p-0 border"><input type="text" readOnly value={prix.tage} className="w-full bg-red-600 text-black p-1 text-center border-0" /></td>
                                                            <td className="p-0 border"><input type="text" readOnly value={prix.prixRevient} className="w-full bg-red-600 text-black p-1 text-center border-0" /></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                    </div>
                                    <div className="flex-shrink-0 mt-1">
                                        <table className="w-full text-sm text-center border-collapse">
                                            <tbody>
                                            <tr>
                                                    <td className="p-0 border"><input type="text" name="designation" value={newPrixUnitaire.designation || ''} onChange={handleNewPrixUnitaireChange} onKeyDown={handlePrixUnitaireKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Désignation" /></td>
                                                    <td className="p-0 border"><input type="text" name="qte" value={newPrixUnitaire.qte || ''} onChange={handleNewPrixUnitaireChange} onKeyDown={handlePrixUnitaireKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Qté" /></td>
                                                    <td className="p-0 border"><input type="text" name="fob" value={newPrixUnitaire.fob || ''} onChange={handleNewPrixUnitaireChange} onKeyDown={handlePrixUnitaireKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="FOB (Montant)" /></td>
                                                    <td className="p-0 border"><input type="text" name="cfa" value={newPrixUnitaire.cfa || ''} onChange={handleNewPrixUnitaireChange} onKeyDown={handlePrixUnitaireKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="CFA (Montant)" /></td>
                                                    <td className="p-0 border"><input type="text" name="tage" value={newPrixUnitaire.tage || ''} onChange={handleNewPrixUnitaireChange} onKeyDown={handlePrixUnitaireKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="%tage" /></td>
                                                    <td className="p-0 border"><input type="text" name="prixRevient" value={newPrixUnitaire.prixRevient || ''} onChange={handleNewPrixUnitaireChange} onKeyDown={handlePrixUnitaireKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Prix revient" /></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Section>
                            </div>
                        </div>

                        <Section title="Douanes" className="flex-shrink-0">
                            <div className="grid grid-cols-4 gap-x-2 gap-y-1">
                                <FormGroup className="col-span-1"><FormInput label="Nom transit :" defaultValue="RINJ" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Mt tva Fact.Trans :" defaultValue="66 596" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Droit douane :" defaultValue="13 303 435" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Frais phyto. :" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="N° Facture :" defaultValue="872" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="N° Dos. tran. :" defaultValue="20220470" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Droit D. taxe :" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Frais dépotage :" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Date Fac tran :" defaultValue="18/03/2022" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="N° déclarat° :" defaultValue="D3 N° C 13766" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Mt TVA doua :" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="N° CC transit :" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Mont transit :" defaultValue="14 070 011" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Date déclar. :" defaultValue="16/03/2022" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Mt TS douane :" defaultValue="200 000" /></FormGroup>
                                <FormGroup className="col-span-1"><FormInput label="Mt TVA interv. :" /></FormGroup>
                            </div>
                        </Section>
                    </div>
                    
                    {/* Col 3 */}
                    <div className="col-span-3 row-start-1 min-h-0">
                        <div className="bg-[#e0e7ff] p-0.5 h-full">
                            <h2 className="bg-lime-300 text-black font-bold p-0.5 text-sm">Détails administratifs</h2>
                            <div className="p-0">
                                <div className="grid grid-cols-2 gap-px text-xs">
                                    <AdminDetailGroup title="Aconnier" />
                                    <AdminDetailGroup title="Fret" />
                                    <AdminDetailGroup title="Transport" />
                                    <AdminDetailGroup title="Change" />
                                    <AdminDetailGroup title="Surestaire" />
                                    <AdminDetailGroup title="Magasinnage" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Règlements Section */}
                    <div className="col-start-3 col-span-10 row-start-2 flex flex-col min-h-0">
                        <Section title="Règlements" className="h-full flex flex-col">
                            <div className="overflow-y-auto flex-grow">
                                <table className="w-full text-sm text-center border-collapse">
                                    <thead className="bg-white sticky top-0">
                                        <tr>
                                            <th className="border p-1 font-semibold">Date</th>
                                            <th className="border p-1 font-semibold">Référence</th>
                                            <th className="border p-1 font-semibold">Mode paiement</th>
                                            <th className="border p-1 font-semibold">Banque</th>
                                            <th className="border p-1 font-semibold">Montant devise</th>
                                            <th className="border p-1 font-semibold">Devise</th>
                                            <th className="border p-1 font-semibold">Cours devise</th>
                                            <th className="border p-1 font-semibold">Montant CFA</th>
                                            <th className="border p-1 font-semibold">Montant TPS</th>
                                            <th className="border p-1 font-semibold">Frais bancaires</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reglements.map(reg => (
                                            <tr key={reg.id} onClick={() => selectReglement(reg)} className={`cursor-pointer ${selectedReglementId === reg.id ? 'ring-2 ring-blue-500' : ''}`}>
                                                <td className="p-0 border"><input type="text" readOnly value={reg.date} className="w-full p-1 text-center border-0 bg-blue-400" /></td>
                                                <td className="p-0 border"><input type="text" readOnly value={reg.reference} className="w-full p-1 text-center border-0 bg-lime-200" /></td>
                                                <td className="p-0 border"><input type="text" readOnly value={reg.modePaiement} className="w-full p-1 text-center border-0 bg-lime-200" /></td>
                                                <td className="p-0 border"><input type="text" readOnly value={reg.banque} className="w-full p-1 text-center border-0 bg-lime-200" /></td>
                                                <td className="p-0 border"><input type="text" readOnly value={reg.montantDevise} className="w-full p-1 text-center border-0 bg-orange-400" /></td>
                                                <td className="p-0 border"><input type="text" readOnly value={reg.devise} className="w-full p-1 text-center border-0 bg-lime-200" /></td>
                                                <td className="p-0 border"><input type="text" readOnly value={reg.coursDevise} className="w-full p-1 text-center border-0 bg-orange-400" /></td>
                                                <td className="p-0 border"><input type="text" readOnly value={reg.montantCFA} className="w-full p-1 text-center border-0 bg-orange-400" /></td>
                                                <td className="p-0 border"><input type="text" readOnly value={reg.montantTPS} className="w-full p-1 text-center border-0 bg-orange-400" /></td>
                                                <td className="p-0 border"><input type="text" readOnly value={reg.fraisBancaires} className="w-full p-1 text-center border-0 bg-orange-400" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-1 flex-shrink-0">
                                <table className="w-full text-sm text-center border-collapse">
                                    <tbody>
                                    <tr>
                                        <td className="p-0 border"><input type="text" name="date" value={newReglement.date || ''} onChange={handleNewReglementChange} onKeyDown={handleReglementKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Date"/></td>
                                        <td className="p-0 border"><input type="text" name="reference" value={newReglement.reference || ''} onChange={handleNewReglementChange} onKeyDown={handleReglementKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Référence"/></td>
                                        <td className="p-0 border"><input type="text" name="modePaiement" value={newReglement.modePaiement || ''} onChange={handleNewReglementChange} onKeyDown={handleReglementKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Mode paiement"/></td>
                                        <td className="p-0 border"><input type="text" name="banque" value={newReglement.banque || ''} onChange={handleNewReglementChange} onKeyDown={handleReglementKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Banque"/></td>
                                        <td className="p-0 border"><input type="text" name="montantDevise" value={newReglement.montantDevise || ''} onChange={handleNewReglementChange} onKeyDown={handleReglementKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Montant devise"/></td>
                                        <td className="p-0 border"><input type="text" name="devise" value={newReglement.devise || ''} onChange={handleNewReglementChange} onKeyDown={handleReglementKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Devise"/></td>
                                        <td className="p-0 border"><input type="text" name="coursDevise" value={newReglement.coursDevise || ''} onChange={handleNewReglementChange} onKeyDown={handleReglementKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Cours devise"/></td>
                                        <td className="p-0 border"><input type="text" name="montantCFA" value={newReglement.montantCFA || ''} onChange={handleNewReglementChange} onKeyDown={handleReglementKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Montant CFA"/></td>
                                        <td className="p-0 border"><input type="text" name="montantTPS" value={newReglement.montantTPS || ''} onChange={handleNewReglementChange} onKeyDown={handleReglementKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Montant TPS"/></td>
                                        <td className="p-0 border"><input type="text" name="fraisBancaires" value={newReglement.fraisBancaires || ''} onChange={handleNewReglementChange} onKeyDown={handleReglementKeyDown} className="w-full p-1 bg-white border-gray-400" placeholder="Frais bancaires"/></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// --- 3. HOME PAGE COMPONENT ---
// ============================================================================
const HomePage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('Dossiers');
    
    const ToolbarButton = ({ icon, label, subLabel = '', onClick }: { icon: string; label: string; subLabel?: string; onClick?: () => void }) => (
        <button onClick={onClick} className="flex flex-col items-center justify-start text-center p-2 hover:bg-gray-200 rounded h-full">
            <span className="text-3xl">{icon}</span>
            <span className="text-xs leading-tight mt-1">{label}</span>
            {subLabel && <span className="text-xs leading-tight">{subLabel}</span>}
        </button>
    );

    return (
      <div className="h-screen w-screen flex flex-col bg-[#e0e7f1] font-sans">
        <header className="bg-white shadow-md flex-shrink-0">
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center">
                    <span className="text-lg">🔽</span>
                    <div className="h-6 w-px bg-gray-300 mx-2"></div>
                    {['Dossiers', 'Statistiques', 'Paramètres'].map(tab => (
                        <button key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1 text-sm flex items-center ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}>
                            <span className="mr-1">{icons[tab.toLowerCase() as keyof typeof icons]}</span>
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="text-sm font-bold">Smart fret</div>
            </div>
            <div className="bg-gray-100 border-y border-gray-300 px-2 h-20 flex items-stretch">
                {activeTab === 'Dossiers' && (
                    <>
                        <ToolbarButton icon={icons.add} label="Ajouter" subLabel="dossiers" onClick={() => onNavigate('form')} />
                        <ToolbarButton icon={icons.reglements} label="Etat des" subLabel="règlements" />
                        <ToolbarButton icon={icons.costs} label="Etat des coûts" subLabel="de revient" />
                        <ToolbarButton icon={icons.commissions} label="Etat des commissions" subLabel="banques" />
                        <ToolbarButton icon={icons.declarations} label="Etat des" subLabel="déclarations" />
                        <ToolbarButton icon={icons.d3} label="Etat" subLabel="des D3" />
                        <ToolbarButton icon={icons.monthly} label="Etat mensuel" subLabel="des d'clarations" />
                        <ToolbarButton icon={icons.orders} label="Etat des" subLabel="commandes" />
                        <ToolbarButton icon={icons.oldCosts} label="Coût de" subLabel="revients anciens" />
                        <div className="h-full w-px bg-gray-300 mx-2"></div>
                        <ToolbarButton icon={icons.close} label="Fermer" />
                    </>
                )}
                {activeTab !== 'Dossiers' && <div className="text-sm text-gray-500 p-4">Menu pour {activeTab}</div>}
            </div>
        </header>
        <main className="flex-grow flex items-center justify-center text-gray-500">
          Sélectionnez "Ajouter dossiers" pour commencer.
        </main>
        <footer className="bg-gray-200 text-sm p-1 border-t border-gray-300 flex-shrink-0">
          UTILISATEUR CONNECTE : MOHAMED
        </footer>
    </div>
    );
};


// ============================================================================
// --- 4. MAIN APP COMPONENT (Router) ---
// ============================================================================
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'home', or 'form'

  const handleLogin = (username: string, password: string): void => {
    if (username === 'a' && password === 'a') {
      setIsLoggedIn(true);
      setCurrentPage('home'); 
    } else {
      alert('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  };

  switch (currentPage) {
    case 'login':
      return <LoginPage onLogin={handleLogin} />;
    case 'form':
      return <FormPage onNavigate={setCurrentPage} />;
    case 'home':
    default:
      return <HomePage onNavigate={setCurrentPage} />;
  }
}

export default App;
