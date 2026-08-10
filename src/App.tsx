import { useEffect, useState } from 'react'
import './App.css'

type Currency = 'CLP' | 'USD' | 'EUR'

type HistoryItem = {
  id: number
  price: number
  discount: number
  savings: number
  finalPrice: number
  currency: Currency
}

type Theme = 'dark' | 'light'

function App() {
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState(30)
  const [customDiscount, setCustomDiscount] = useState('')

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('discountlab-theme')

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    return 'dark'
  })

  const [currency, setCurrency] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem('discountlab-currency')

    if (
      savedCurrency === 'CLP' ||
      savedCurrency === 'USD' ||
      savedCurrency === 'EUR'
    ) {
      return savedCurrency
    }

    return 'CLP'
  })

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const savedHistory = localStorage.getItem('discountlab-history')

      if (!savedHistory) {
        return []
      }

      const parsedHistory = JSON.parse(savedHistory)

      if (!Array.isArray(parsedHistory)) {
        return []
      }

      return parsedHistory.map((item) => ({
        ...item,
        currency: item.currency ?? 'CLP',
      }))
    } catch {
      return []
    }
  })

  const discounts = [
    5,
    10,
    25,
    30,
    35,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
  ]

  const numericPrice = Number(price) || 0
  const savings = numericPrice * (discount / 100)
  const finalPrice = numericPrice - savings

  useEffect(() => {
    localStorage.setItem(
      'discountlab-history',
      JSON.stringify(history)
    )
  }, [history])

  useEffect(() => {
    localStorage.setItem('discountlab-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('discountlab-currency', currency)
  }, [currency])

  const formatMoney = (
    value: number,
    selectedCurrency: Currency = currency
  ) => {
    const locales: Record<Currency, string> = {
      CLP: 'es-CL',
      USD: 'en-US',
      EUR: 'de-DE',
    }

    return new Intl.NumberFormat(locales[selectedCurrency], {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits:
        selectedCurrency === 'CLP' ? 0 : 2,
      maximumFractionDigits:
        selectedCurrency === 'CLP' ? 0 : 2,
    }).format(value)
  }

  const applyCustomDiscount = () => {
    const value = Number(customDiscount)

    if (value >= 0 && value <= 100) {
      setDiscount(value)
    }
  }

  const saveToHistory = () => {
    if (numericPrice <= 0) {
      return
    }

    const newItem: HistoryItem = {
      id: Date.now(),
      price: numericPrice,
      discount,
      savings,
      finalPrice,
      currency,
    }

    setHistory((currentHistory) => {
      const updatedHistory = [
        newItem,
        ...currentHistory,
      ]

      return updatedHistory.slice(0, 10)
    })
  }

  const clearCalculator = () => {
    setPrice('')
    setDiscount(30)
    setCustomDiscount('')
  }

  const clearHistory = () => {
    setHistory([])
  }

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'dark' ? 'light' : 'dark'
    )
  }

  return (
    <main className={`app ${theme}`}>
      <section className="calculator">

        <div className="topBar">
          <div>
            <p className="eyebrow">
              SMART DISCOUNT CALCULATOR
            </p>

            <h1>DiscountLab</h1>
          </div>

          <button
            type="button"
            className="themeButton"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            title="Cambiar modo claro u oscuro"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <p className="subtitle">
          Calcula el precio final de cualquier producto en segundos.
        </p>

        <div className="currencySection">
          <span className="label">
            Moneda
          </span>

          <div className="currencyGrid">

            <button
              type="button"
              className={currency === 'CLP' ? 'active' : ''}
              onClick={() => setCurrency('CLP')}
            >
              🇨🇱 CLP
            </button>

            <button
              type="button"
              className={currency === 'USD' ? 'active' : ''}
              onClick={() => setCurrency('USD')}
            >
              🇺🇸 USD
            </button>

            <button
              type="button"
              className={currency === 'EUR' ? 'active' : ''}
              onClick={() => setCurrency('EUR')}
            >
              🇪🇺 EUR
            </button>

          </div>

          <p className="currencyHint">
            Selecciona la moneda en la que está expresado el precio.
          </p>
        </div>

        <div className="inputGroup">
          <label htmlFor="price">
            Precio original
          </label>

          <input
            id="price"
            type="number"
            min="0"
            step="any"
            placeholder={
              currency === 'CLP'
                ? 'Ej: 89990'
                : 'Ej: 89.99'
            }
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
          />
        </div>

        <div className="discountSection">
          <span className="label">
            Selecciona un descuento
          </span>

          <div className="discountGrid">

            {discounts.map((percentage) => (
              <button
                key={percentage}
                type="button"
                className={
                  discount === percentage
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setDiscount(percentage)
                }
              >
                {percentage}%
              </button>
            ))}

          </div>
        </div>

        <div className="customDiscount">
          <label htmlFor="customDiscount">
            Otro porcentaje
          </label>

          <div className="customDiscountRow">

            <input
              id="customDiscount"
              type="number"
              min="0"
              max="100"
              placeholder="Ej: 18"
              value={customDiscount}
              onChange={(event) =>
                setCustomDiscount(event.target.value)
              }
            />

            <button
              type="button"
              onClick={applyCustomDiscount}
            >
              Aplicar
            </button>

          </div>
        </div>

        <section className="resultCard">

          <div className="discountBadge">
            {discount}% OFF
          </div>

          <div className="resultRow">
            <span>Precio original</span>

            <strong>
              {formatMoney(numericPrice)}
            </strong>
          </div>

          <div className="resultRow savings">
            <span>Ahorras</span>

            <strong>
              {formatMoney(savings)}
            </strong>
          </div>

          <div className="divider" />

          <div className="total">
            <span>Precio final</span>

            <strong>
              {formatMoney(finalPrice)}
            </strong>
          </div>

        </section>

        <div className="actionButtons">

          <button
            type="button"
            className="saveButton"
            onClick={saveToHistory}
          >
            Guardar cálculo
          </button>

          <button
            type="button"
            className="clearButton"
            onClick={clearCalculator}
          >
            Limpiar
          </button>

        </div>

        <section className="historySection">

          <div className="historyHeader">

            <div>
              <p className="historyEyebrow">
                ACTIVIDAD RECIENTE
              </p>

              <h2>Historial</h2>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                className="clearHistoryButton"
                onClick={clearHistory}
              >
                Borrar historial
              </button>
            )}

          </div>

          {history.length === 0 ? (

            <div className="emptyHistory">
              <p>
                Aún no tienes cálculos guardados.
              </p>

              <span>
                Realiza un cálculo y presiona
                “Guardar cálculo”.
              </span>
            </div>

          ) : (

            <div className="historyList">

              {history.map((item) => (

                <article
                  className="historyItem"
                  key={item.id}
                >

                  <div className="historyTop">

                    <strong>
                      {item.discount}% OFF
                    </strong>

                    <span>
                      {formatMoney(
                        item.finalPrice,
                        item.currency
                      )}
                    </span>

                  </div>

                  <div className="historyDetails">

                    <span>
                      Original:{' '}
                      {formatMoney(
                        item.price,
                        item.currency
                      )}
                    </span>

                    <span>
                      Ahorras:{' '}
                      {formatMoney(
                        item.savings,
                        item.currency
                      )}
                    </span>

                    <span>
                      {item.currency}
                    </span>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </section>
    </main>
  )
}

export default App