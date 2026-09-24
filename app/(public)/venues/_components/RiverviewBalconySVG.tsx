'use client'

const amethystHover = 'fill-purple-700 hover:fill-purple-600 duration-200' // Slightly lighter
const magentaHover = 'fill-pink-700 hover:fill-pink-600 duration-200' // Slightly lighter
const forestHover = 'fill-lime-600 hover:fill-lime-500 duration-200'
const tealHover = 'fill-blue-600 hover:fill-blue-500 duration-200' // Slightly lighter

const RiverviewBalconySVG = ({ setRiverviewBalcony }: any) => {
  const onHoverSeat = (e: any) => {
    const target = e.target as SVGElement
    const seat = target.getAttribute('data-seat')
    const price = target.getAttribute('data-price')
    const level = target.getAttribute('data-level')

    setRiverviewBalcony({
      visible: true,
      seat,
      price,
      level
    })
  }

  const onLeaveSeat = () => {
    setRiverviewBalcony({ visible: false, seat: '', x: 0, y: 0, price: '', level: '' })
  }
  return (
    <div className="relative w-full">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1060 180"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current"
      >
        {/* Row A */}
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="5" y="20" fontSize="13" className="text-white font-bold">
            A
          </text>
          {[
            // Left Premium block
            ...Array.from({ length: 11 }, (_, i) => ({
              x: 20 + i * 20,
              seat: `A${49 - i}`,
              price: 50,
              level: 'Premium',
              className: amethystHover
            })),

            // Left Ultra block
            ...Array.from({ length: 27 }, (_, i) => ({
              x: 280 + i * 20,
              seat: `A${38 - i}`,
              price: 65,
              level: 'Ultra',
              className: magentaHover
            })),

            // Middle Ultra block (after aisle)
            ...Array.from({ length: 11 }, (_, i) => ({
              x: 840 + i * 20,
              seat: `A${11 - i}`,
              price: 50,
              level: 'Premium',
              className: amethystHover
            }))
          ].map(({ x, seat, price, level, className }) => (
            <rect
              key={seat}
              x={x}
              y="7"
              width="16"
              height="16"
              className={className}
              data-price={price}
              data-seat={seat}
              data-level={level}
            />
          ))}
        </g>
        {/* Row B */}
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="45" y="40" fontSize="13" className="text-white font-bold">
            B
          </text>
          {[
            // Left Premium block
            ...Array.from({ length: 2 }, (_, i) => ({
              x: 60 + i * 20,
              seat: `B${45 - i}`,
              price: 35,
              level: 'Wheelchair',
              className: tealHover
            })),

            // Left Ultra block
            ...Array.from({ length: 7 }, (_, i) => ({
              x: 100 + i * 20,
              seat: `B${43 - i}`,
              price: 50,
              level: 'Premium',
              className: amethystHover
            })),

            // Middle Ultra block (after aisle)
            ...Array.from({ length: 28 }, (_, i) => ({
              x: 260 + i * 20,
              seat: `B${36 - i}`,
              price: 65,
              level: 'Ultra',
              className: magentaHover
            })),
            ...Array.from({ length: 6 }, (_, i) => ({
              x: 840 + i * 20,
              seat: `B${8 - i}`,
              price: 50,
              level: 'Premium',
              className: amethystHover
            })),
            ...Array.from({ length: 1 }, (_, i) => ({
              x: 960 + i * 20,
              seat: `B${2 - i}`,
              price: 35,
              level: 'Wheelchair',
              className: tealHover
            })),
            ...Array.from({ length: 1 }, (_, i) => ({
              x: 1000 + i * 20,
              seat: `B${1 - i}`,
              price: 35,
              level: 'Wheelchair',
              className: tealHover
            }))
          ].map(({ x, seat, price, level, className }) => (
            <rect
              key={seat}
              x={x}
              y="27"
              width="16"
              height="16"
              className={className}
              data-price={price}
              data-seat={seat}
              data-level={level}
            />
          ))}
        </g>
        {/* Row C */}
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="105" y="60" fontSize="13" className="text-white font-bold">
            C
          </text>
          {[
            // Left Ultra block
            ...Array.from({ length: 6 }, (_, i) => ({
              x: 120 + i * 20,
              seat: `C${40 - i}`,
              price: 50,
              level: 'Premium',
              className: amethystHover
            })),

            // Middle Ultra block (after aisle)
            ...Array.from({ length: 28 }, (_, i) => ({
              x: 260 + i * 20,
              seat: `C${34 - i}`,
              price: 65,
              level: 'Premium',
              className: magentaHover
            })),
            ...Array.from({ length: 6 }, (_, i) => ({
              x: 840 + i * 20,
              seat: `C${6 - i}`,
              price: 50,
              level: 'Premium',
              className: amethystHover
            }))
          ].map(({ x, seat, price, level, className }) => (
            <rect
              key={seat}
              x={x}
              y="47"
              width="16"
              height="16"
              className={className}
              data-price={price}
              data-seat={seat}
              data-level={level}
            />
          ))}
        </g>
        {/* Row D */}
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="285" y="80" fontSize="13" className="text-white font-bold">
            D
          </text>
          {[
            // Left Ultra block
            ...Array.from({ length: 22 }, (_, i) => ({
              x: 300 + i * 20,
              seat: `D${22 - i}`,
              price: 50,
              level: 'Premium',
              className: amethystHover
            }))
          ].map(({ x, seat, price, level, className }) => (
            <rect
              key={seat}
              x={x}
              y="67"
              width="16"
              height="16"
              className={className}
              data-price={price}
              data-seat={seat}
              data-level={level}
            />
          ))}
        </g>
        {/* Row E */}
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="265" y="100" fontSize="13" className="text-white font-bold">
            E
          </text>
          {[
            // Left Ultra block
            ...Array.from({ length: 23 }, (_, i) => ({
              x: 280 + i * 20,
              seat: `E${23 - i}`,
              price: 35,
              level: 'General',
              className: forestHover
            }))
          ].map(({ x, seat, price, level, className }) => (
            <rect
              key={seat}
              x={x}
              y="87"
              width="16"
              height="16"
              className={className}
              data-price={price}
              data-seat={seat}
              data-level={level}
            />
          ))}
        </g>
        {/* Row F */}
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="80" y="120" fontSize="13" className="text-white font-bold">
            F
          </text>
          {[
            ...Array.from({ length: 8 }, (_, i) => ({
              x: 100 + i * 20,
              seat: `F${39 - i}`,
              price: 35,
              level: 'General',
              className: forestHover
            })),

            ...Array.from({ length: 23 }, (_, i) => ({
              x: 280 + i * 20,
              seat: `F${31 - i}`,
              price: 35,
              level: 'General',
              className: forestHover
            })),
            ...Array.from({ length: 8 }, (_, i) => ({
              x: 760 + i * 20,
              seat: `F${8 - i}`,
              price: 35,
              level: 'General',
              className: forestHover
            }))
          ].map(({ x, seat, price, level, className }) => (
            <rect
              key={seat}
              x={x}
              y="107"
              width="16"
              height="16"
              className={className}
              data-price={price}
              data-seat={seat}
              data-level={level}
            />
          ))}
        </g>
        {/* Row G */}
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="80" y="140" fontSize="13" className="text-white font-bold">
            G
          </text>
          {[
            ...Array.from({ length: 8 }, (_, i) => ({
              x: 100 + i * 20,
              seat: `F${39 - i}`,
              price: 35,
              level: 'General',
              className: forestHover
            })),

            ...Array.from({ length: 23 }, (_, i) => ({
              x: 280 + i * 20,
              seat: `F${31 - i}`,
              price: 35,
              level: 'General',
              className: forestHover
            })),
            ...Array.from({ length: 8 }, (_, i) => ({
              x: 760 + i * 20,
              seat: `F${8 - i}`,
              price: 35,
              level: 'General',
              className: forestHover
            }))
          ].map(({ x, seat, price, level, className }) => (
            <rect
              key={seat}
              x={x}
              y="127"
              width="16"
              height="16"
              className={className}
              data-price={price}
              data-seat={seat}
              data-level={level}
            />
          ))}
        </g>
        {/* Row H */}
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="80" y="160" fontSize="13" className="text-white font-bold">
            H
          </text>
          {[
            ...Array.from({ length: 8 }, (_, i) => ({
              x: 100 + i * 20,
              seat: `H${39 - i}`,
              price: 35,
              level: 'General',
              className: forestHover
            })),

            ...Array.from({ length: 23 }, (_, i) => ({
              x: 280 + i * 20,
              seat: `H${31 - i}`,
              price: 35,
              level: 'General',
              className: forestHover
            })),
            ...Array.from({ length: 8 }, (_, i) => ({
              x: 760 + i * 20,
              seat: `H${8 - i}`,
              price: 35,
              level: 'General',
              className: forestHover
            }))
          ].map(({ x, seat, price, level, className }) => (
            <rect
              key={seat}
              x={x}
              y="147"
              width="16"
              height="16"
              className={className}
              data-price={price}
              data-seat={seat}
              data-level={level}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default RiverviewBalconySVG
