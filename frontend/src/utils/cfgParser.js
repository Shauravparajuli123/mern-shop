// CFG Grammar:
// Query   → Action FilterList
// Action  → "show" | "find" | "get" | "search"
// Filter  → Color | Category | PriceFilter
// Color   → "red"|"blue"|"green"|"black"|"white"|"yellow"|"pink"
// Category→ "shirts"|"shoes"|"pants"|"bags"|"watches"|"phones"
// Price   → "under" "$"? Number | "below" "$"? Number | "over" "$"? Number

const COLORS     = ['red','blue','green','black','white','yellow','pink','purple','orange'];
const CATEGORIES = ['shirt','shirts','shoe','shoes','pant','pants',
                    'bag','bags','watch','watches','phone','phones',
                    'laptop','laptops','dress','dresses'];
const ACTIONS    = ['show','find','get','search','display','list'];

export const parseCFG = (query) => {
  if (!query.trim()) return null;

  const tokens = query.toLowerCase()
    .replace(/[?,!.]/g, '')
    .split(/\s+/);

  const result = {
    action:   null,
    colors:   [],
    category: null,
    price:    null,
    operator: null, // under | over
    raw:      query,
    parseTree: [],
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Match Action
    if (ACTIONS.includes(token)) {
      result.action = token;
      result.parseTree.push({ type: 'Action', value: token });
      continue;
    }

    // Match Color
    if (COLORS.includes(token)) {
      result.colors.push(token);
      result.parseTree.push({ type: 'Color', value: token });
      continue;
    }

    // Match Category
    if (CATEGORIES.includes(token)) {
      result.category = token.replace(/s$/, ''); // normalize plural
      result.parseTree.push({ type: 'Category', value: token });
      continue;
    }

    // Match Price — "under $50" or "below 50" or "over $100"
    if (['under', 'below', 'less'].includes(token)) {
      result.operator = 'under';
      result.parseTree.push({ type: 'PriceOp', value: token });
      const next = tokens[i + 1]?.replace('$', '');
      if (next && !isNaN(next)) {
        result.price = parseFloat(next);
        result.parseTree.push({ type: 'Price', value: result.price });
        i++;
      }
      continue;
    }

    if (['over', 'above', 'more'].includes(token)) {
      result.operator = 'over';
      result.parseTree.push({ type: 'PriceOp', value: token });
      const next = tokens[i + 1]?.replace('$', '');
      if (next && !isNaN(next)) {
        result.price = parseFloat(next);
        result.parseTree.push({ type: 'Price', value: result.price });
        i++;
      }
      continue;
    }

    // Bare number like "$50"
    const num = token.replace('$', '');
    if (!isNaN(num) && num !== '') {
      result.price = parseFloat(num);
      result.parseTree.push({ type: 'Price', value: result.price });
    }
  }

  return result;
};

// Apply parsed CFG result to filter products
export const applyParsedQuery = (products, parsed) => {
  if (!parsed) return products;

  return products.filter((p) => {
    // Color filter
    if (parsed.colors.length > 0) {
      const nameDesc = (p.name + ' ' + p.description).toLowerCase();
      const hasColor = parsed.colors.some((c) => nameDesc.includes(c));
      if (!hasColor) return false;
    }

    // Category filter
    if (parsed.category) {
      const catMatch =
        p.category.toLowerCase().includes(parsed.category) ||
        p.name.toLowerCase().includes(parsed.category);
      if (!catMatch) return false;
    }

    // Price filter
    if (parsed.price !== null) {
      if (parsed.operator === 'under' && p.price >= parsed.price) return false;
      if (parsed.operator === 'over'  && p.price <= parsed.price) return false;
    }

    return true;
  });
};