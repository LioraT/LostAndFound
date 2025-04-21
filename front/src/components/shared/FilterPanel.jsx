import styles from "../../styles/theme.module.css";

export default function FilterPanel({ filter, onChange, showRadius = false }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filter, [name]: value });
  };

  return (
    <div className={styles.filterPanel}>
      <label>
        Category:
        <select name="item_category" value={filter.item_category} onChange={handleChange}>
          <option value="">All</option>
          <option value="keys">Keys</option>
          <option value="wallet">Wallet</option>
          <option value="phone">Phone</option>
          <option value="jewelry">Jewelry</option>
          <option value="bag">Bag</option>
          <option value="headphones">Headphones</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label>
        Type:
        <select name="item_type" value={filter.item_type} onChange={handleChange}>
          <option value="">All</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </label>

      <label>
        Resolved:
        <select name="resolved" value={filter.resolved} onChange={handleChange}>
          <option value="">All</option>
          <option value="false">Unresolved</option>
          <option value="true">Resolved</option>
        </select>
      </label>

      <label>
        Keywords:
        <input
          type="text"
          name="keywords"
          placeholder="Title or description..."
          value={filter.keywords}
          onChange={handleChange}
        />
      </label>

      {showRadius && (
        <label>
          Radius (meters):
          <input
            type="number"
            name="radius"
            value={filter.radius}
            onChange={handleChange}
            min={100}
            max={10000}
            step={100}
          />
        </label>
      )}
    </div>
  );
}
