from .models import Asset, Lesson, ShopItem


ASSETS = [
    ("AAPL", "Apple", "stock", "Technology", "medium", 190),
    ("MSFT", "Microsoft", "stock", "Technology", "medium", 410),
    ("GOOGL", "Alphabet", "stock", "Technology", "medium", 170),
    ("AMZN", "Amazon", "stock", "Consumer", "medium", 180),
    ("NVDA", "NVIDIA", "stock", "Technology", "high", 850),
    ("TSLA", "Tesla", "stock", "Automotive", "high", 240),
    ("META", "Meta", "stock", "Technology", "medium", 490),
    ("JPM", "JPMorgan", "stock", "Financials", "low", 205),
    ("V", "Visa", "stock", "Financials", "low", 290),
    ("KO", "Coca-Cola", "stock", "Consumer", "low", 62),
    ("PFE", "Pfizer", "stock", "Healthcare", "low", 29),
    ("XOM", "ExxonMobil", "stock", "Energy", "medium", 114),
    ("WMT", "Walmart", "stock", "Consumer", "low", 71),
    ("DIS", "Disney", "stock", "Communication", "medium", 106),
    ("NFLX", "Netflix", "stock", "Communication", "high", 610),
    ("BTC", "Bitcoin", "crypto", "Crypto", "high", 68000),
    ("ETH", "Ethereum", "crypto", "Crypto", "high", 3500),
    ("SOL", "Solana", "crypto", "Crypto", "high", 145),
    ("ADA", "Cardano", "crypto", "Crypto", "high", 0.62),
    ("DOGE", "Dogecoin", "crypto", "Crypto", "high", 0.18),
]

LESSONS = [
    {
        "id": 1,
        "title": "Diversification Basics",
        "body": "Diversification means spreading investments across assets to reduce concentration risk.",
        "quiz_json": [
            {
                "id": "q1",
                "question": "What does diversification reduce?",
                "options": ["Concentration risk", "All market risk", "Taxes"],
                "answer": "Concentration risk",
            },
            {
                "id": "q2",
                "question": "Is diversification guaranteed profit?",
                "options": ["Yes", "No"],
                "answer": "No",
            },
        ],
    },
    {
        "id": 2,
        "title": "Risk vs Reward",
        "body": "Higher potential return typically comes with higher volatility and drawdown risk.",
        "quiz_json": [
            {
                "id": "q1",
                "question": "Higher return potential usually means:",
                "options": ["Lower risk", "Higher risk"],
                "answer": "Higher risk",
            },
            {
                "id": "q2",
                "question": "A healthy habit is to:",
                "options": ["Bet all on one asset", "Review allocation regularly"],
                "answer": "Review allocation regularly",
            },
        ],
    },
]

SHOP_ITEMS = [
    (1, "accessory", "hat", "Leaf Cap", 60),
    (2, "accessory", "hat", "Space Helmet", 100),
    (3, "accessory", "glasses", "Scholar Glasses", 90),
    (4, "skin", "skin", "Golden Fur", 180),
    (5, "skin", "skin", "Nebula Coat", 220),
    (6, "toy", "toy", "Coin Ball", 45),
    (7, "toy", "toy", "Puzzle Cube", 55),
    (8, "outfit", "body", "Trader Jacket", 130),
    (9, "habitat", "background", "Forest Home", 200),
    (10, "habitat", "background", "City Loft", 250),
    (11, "habitat", "background", "Moon Base", 320),
]


def seed_if_needed(db):
    if db.query(Asset).count() == 0:
        for symbol, name, asset_type, sector, risk, base_price in ASSETS:
            db.add(
                Asset(
                    symbol=symbol,
                    name=name,
                    type=asset_type,
                    sector=sector,
                    risk_class=risk,
                    base_price=base_price,
                )
            )

    if db.query(Lesson).count() == 0:
        for lesson in LESSONS:
            db.add(
                Lesson(
                    id=lesson["id"],
                    title=lesson["title"],
                    body=lesson["body"],
                    quiz_json=lesson["quiz_json"],
                    reward_xp=40,
                    reward_coins=50,
                )
            )

    if db.query(ShopItem).count() == 0:
        for item_id, item_type, slot, name, cost in SHOP_ITEMS:
            db.add(
                ShopItem(
                    id=item_id,
                    type=item_type,
                    slot=slot,
                    name=name,
                    coin_cost=cost,
                    metadata_json={},
                )
            )

    db.commit()
