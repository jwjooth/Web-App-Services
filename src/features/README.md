# Frontend feature boundaries

- `catalog/` owns product types, display helpers, and demo catalog data.
- `cart/` owns in-memory shopping cart state and quantity operations.
- `orders/` owns typed sample order records and status definitions.
- `user/` owns typed demo profile and delivery address records.
- `ServicePages.tsx` displays Orders, Products, and Account screens with session-only interactions.
- `components/` contains shared presentation primitives.
- `App.tsx` composes the marketplace and demo interactions.

This application is a frontend demo, not a deployed microservices system. No backend,
database, payment provider, authentication, or infrastructure is configured.

When external contracts are available, introduce typed API adapters inside each feature.
Catalog, search, pricing/promotions, inventory, identity, cart, orders, payments, and
shipping can be independently maintained service domains behind an external API gateway.
Keep credentials and payment processing outside this frontend. Revalidate prices,
inventory, vouchers, and authorization on the appropriate external services at checkout.

Cart and saved-product state are intentionally in-memory and reset on page reload.
Order cancellation, profile edits, address changes, and notification preferences also
reset on reload. Tracking events and product stock labels are explicitly sample data.
These screens do not authenticate users, process payments, or make API requests.
Replace demo records with contract-defined adapters when external services are ready;
the frontend intentionally does not guess endpoints or require API configuration.
