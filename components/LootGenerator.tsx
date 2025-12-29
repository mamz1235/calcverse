
import React, { useState } from 'react';
import { Sparkles, Dices, Shield, Scroll, FlaskConical, Sword, Copy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { newFeatureTranslations } from '../utils/newFeatureTranslations';

interface LootItem {
  name: string;
  type: string;
  rarity: string;
  value: string;
  description: string;
}

const LootGenerator: React.FC = () => {
  const { language } = useLanguage();
  const t = newFeatureTranslations[language as keyof typeof newFeatureTranslations] || newFeatureTranslations['en'];
  const tr = t.randomness;

  const [level, setLevel] = useState(1);
  const [type, setType] = useState('any');
  const [loot, setLoot] = useState<LootItem | null>(null);

  // Simple Logic Arrays (Simplified for demo, could be expanded or fetched from API)
  const PREFIXES = ['Ancient', 'Cursed', 'Blessed', 'Rusty', 'Glimmering', 'Vorpal', 'Ethereal', 'Shadow'];
  const WEAPONS = ['Sword', 'Axe', 'Bow', 'Dagger', 'Mace', 'Staff', 'Spear'];
  const ARMOR = ['Shield', 'Helm', 'Plate', 'Boots', 'Gauntlets', 'Cloak'];
  const SUFFIXES = ['of Fire', 'of Ice', 'of the Bear', 'of Speed', 'of Doom', 'of Light', 'of the Void'];
  
  const generate = () => {
    // Determine Type
    let actualType = type;
    if (type === 'any') {
        const types = ['weapon', 'armor', 'potion', 'scroll', 'art'];
        actualType = types[Math.floor(Math.random() * types.length)];
    }

    let item: LootItem = {
        name: '',
        type: actualType,
        rarity: 'Common',
        value: '10 gp',
        description: ''
    };

    // Rarity based on Level
    const roll = Math.random() * 100 + (level * 2);
    if (roll > 95) item.rarity = 'Legendary';
    else if (roll > 80) item.rarity = 'Epic';
    else if (roll > 60) item.rarity = 'Rare';
    else if (roll > 40) item.rarity = 'Uncommon';
    else item.rarity = 'Common';

    // Value Multiplier
    const valMult = { Common: 1, Uncommon: 5, Rare: 20, Epic: 100, Legendary: 500 };
    const baseVal = level * 10 * (Math.random() + 0.5);
    // @ts-ignore
    item.value = Math.floor(baseVal * valMult[item.rarity]) + ' gp';

    // Name Generation
    if (actualType === 'weapon') {
        const weapon = WEAPONS[Math.floor(Math.random() * WEAPONS.length)];
        if (item.rarity === 'Common') item.name = `${PREFIXES[3]} ${weapon}`; // Rusty
        else item.name = `${PREFIXES[Math.floor(Math.random() * PREFIXES.length)]} ${weapon} ${SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]}`;
        item.description = `A ${item.rarity.toLowerCase()} weapon. Deals ${Math.ceil(level/2)}d6 damage.`;
    } else if (actualType === 'armor') {
        const armor = ARMOR[Math.floor(Math.random() * ARMOR.length)];
        item.name = `${PREFIXES[Math.floor(Math.random() * PREFIXES.length)]} ${armor}`;
        item.description = `Adds +${Math.ceil(level/3)} to AC.`;
    } else if (actualType === 'potion') {
        item.name = `Potion of ${['Healing', 'Mana', 'Strength', 'Invisibility', 'Flight'][Math.floor(Math.random()*5)]}`;
        item.description = 'Single use. Drink to activate effect.';
    } else if (actualType === 'scroll') {
        item.name = `Scroll of ${['Fireball', 'Teleport', 'Identify', 'Resurrection'][Math.floor(Math.random()*4)]}`;
        item.description = 'Crumbs to dust after reading.';
    } else {
        item.name = `${['Gold', 'Silver', 'Ruby', 'Emerald'][Math.floor(Math.random()*4)]} ${['Ring', 'Statue', 'Necklace', 'Chalice'][Math.floor(Math.random()*4)]}`;
        item.description = 'A valuable object used for trade or decoration.';
    }

    setLoot(item);
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'weapon': return <Sword className="w-8 h-8" />;
          case 'armor': return <Shield className="w-8 h-8" />;
          case 'potion': return <FlaskConical className="w-8 h-8" />;
          case 'scroll': return <Scroll className="w-8 h-8" />;
          default: return <Sparkles className="w-8 h-8" />;
      }
  };

  const getColor = (rarity: string) => {
      switch(rarity) {
          case 'Legendary': return 'text-orange-500 border-orange-500 bg-orange-50 dark:bg-orange-900/20';
          case 'Epic': return 'text-purple-500 border-purple-500 bg-purple-50 dark:bg-purple-900/20';
          case 'Rare': return 'text-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-900/20';
          case 'Uncommon': return 'text-green-500 border-green-500 bg-green-50 dark:bg-green-900/20';
          default: return 'text-slate-500 border-slate-300 bg-slate-50 dark:bg-slate-800';
      }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Dices className="w-6 h-6 text-indigo-500" /> {tr.lootGen}
                </h2>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{tr.lootLevel}</label>
                <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={level} 
                    onChange={e => setLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="text-center font-bold text-slate-700 dark:text-slate-200 mt-1">{level}</div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{tr.lootType}</label>
                <select 
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-border rounded-lg outline-none text-sm"
                >
                    <option value="any">Any</option>
                    <option value="weapon">{tr.types.weapon}</option>
                    <option value="armor">{tr.types.armor}</option>
                    <option value="potion">{tr.types.potion}</option>
                    <option value="scroll">{tr.types.scroll}</option>
                    <option value="art">{tr.types.art}</option>
                </select>
            </div>
        </div>

        <button 
            onClick={generate}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
            <Sparkles className="w-5 h-5" /> {tr.generateLoot}
        </button>

        {loot && (
            <div className={`mt-6 p-4 rounded-xl border-2 ${getColor(loot.rarity)} animate-in slide-in-from-bottom-2 fade-in`}>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/50 dark:bg-black/20 rounded-xl">
                        {getIcon(loot.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg leading-tight">{loot.name}</h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-75 border border-current px-1.5 py-0.5 rounded">{loot.rarity}</span>
                        </div>
                        <p className="text-sm opacity-80 mt-1">{loot.description}</p>
                        <div className="mt-3 flex items-center justify-between text-xs font-medium opacity-70 border-t border-current/20 pt-2">
                            <span>{loot.type.toUpperCase()}</span>
                            <span>{tr.value}: {loot.value}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default LootGenerator;
