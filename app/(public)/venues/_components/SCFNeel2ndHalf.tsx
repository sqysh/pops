'use client'

const amethystHover = 'fill-purple-700 hover:fill-purple-600 duration-200' // Slightly lighter
const magentaHover = 'fill-pink-700 hover:fill-pink-600 duration-200' // Slightly lighter
const forestHover = 'fill-lime-600 hover:fill-lime-500 duration-200'
const tealHover = 'fill-blue-600 hover:fill-blue-500 duration-200' // Slightly lighter

const SCFNeel2ndHalf = ({ setNeel2ndHalf }: any) => {
  const onHoverSeat = (e: any) => {
    const target = e.target as SVGElement
    const seat = target.getAttribute('data-seat')
    const price = target.getAttribute('data-price')
    const level = target.getAttribute('data-level')

    setNeel2ndHalf({
      visible: true,
      seat,
      price,
      level
    })
  }

  const onLeaveSeat = () => {
    setNeel2ndHalf({ visible: false, seat: '', x: 0, y: 0, price: '', level: '' })
  }
  return (
    <div className="relative w-full">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 220"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current"
      >
        {/* Row J */}
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="504" y="22" fontSize="13" className="text-white font-bold">
            J
          </text>
          {Array.from({ length: 7 }, (_, i) => {
            const seatNumber = 27 - i
            const x = 520 + i * 20
            return (
              <rect
                key={`A${seatNumber}`}
                x={x}
                y="10"
                width="16"
                height="16"
                className={magentaHover}
                data-price={65}
                data-seat={`J${seatNumber}`}
                data-level="Ultra"
              />
            )
          })}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="105" y="43" fontSize="13" className="text-white font-bold">
            K
          </text>

          {[
            // Premium seats before the aisle
            ...Array.from({ length: 8 }, (_, i) => ({
              x: 120 + i * 20,
              seat: `K${55 - i}`,
              level: 'Ultra',
              price: 65,
              className: magentaHover
            })),
            ...Array.from({ length: 10 }, (_, i) => ({
              x: 480 + i * 20,
              seat: `K${30 - i}`,
              level: 'Ultra',
              price: 65,
              className: magentaHover
            })),

            ...Array.from({ length: 1 }, (_, i) => ({
              x: 700 + i * 20,
              seat: `K${12 - i}`,
              level: 'Wheelchair',
              price: 35,
              className: tealHover
            })),
            ...Array.from({ length: 1 }, (_, i) => ({
              x: 740 + i * 20,
              seat: `K${11 - i}`,
              level: 'Wheelchair',
              price: 35,
              className: tealHover
            })),
            ...Array.from({ length: 1 }, (_, i) => ({
              x: 780 + i * 20,
              seat: `K${10 - i}`,
              level: 'Wheelchair',
              price: 35,
              className: tealHover
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              x: 820 + i * 20,
              seat: `K${9 - i}`,
              level: 'Wheelchair',
              price: 35,
              className: tealHover
            })),
            ...Array.from({ length: 1 }, (_, i) => ({
              x: 880 + i * 20,
              seat: `K${7 - i}`,
              level: 'Wheelchair',
              price: 35,
              className: tealHover
            })),
            ...Array.from({ length: 3 }, (_, i) => ({
              x: 920 + i * 20,
              seat: `K${6 - i}`,
              level: 'Wheelchair',
              price: 35,
              className: tealHover
            })),
            ...Array.from({ length: 1 }, (_, i) => ({
              x: 1000 + i * 20,
              seat: `K${3 - i}`,
              level: 'Wheelchair',
              price: 35,
              className: tealHover
            })),
            ...Array.from({ length: 1 }, (_, i) => ({
              x: 1040 + i * 20,
              seat: `K${2 - i}`,
              level: 'Wheelchair',
              price: 35,
              className: tealHover
            })),
            ...Array.from({ length: 1 }, (_, i) => ({
              x: 1080 + i * 20,
              seat: `K${1 - i}`,
              level: 'Wheelchair',
              price: 35,
              className: tealHover
            }))
          ].map(({ x, seat, level, price, className }, i) => (
            <rect
              key={i}
              x={x}
              y={30}
              width={16}
              height={16}
              className={className}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="105" y="64" fontSize="13" className="text-white font-bold">
            L
          </text>

          {[
            // Premium seats before the aisle
            ...Array.from({ length: 8 }, (_, i) => ({
              x: 120 + i * 20,
              seat: `L${49 - i}`,
              level: 'Premium',
              price: 50,
              className: amethystHover
            })),
            ...Array.from({ length: 10 }, (_, i) => ({
              x: 280 + i * 20,
              seat: `L${41 - i}`,
              level: 'General',
              price: 35,
              className: forestHover
            })),

            ...Array.from({ length: 31 }, (_, i) => ({
              x: 480 + i * 20,
              seat: `L${31 - i}`,
              level: 'Premium',
              price: 50,
              className: amethystHover
            }))
          ].map(({ x, seat, level, price, className }, i) => (
            <rect
              key={i}
              x={x}
              y={50}
              width={16}
              height={16}
              className={className}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="85" y="84" fontSize="13" className="text-white font-bold">
            M
          </text>

          {[
            // Premium seats before the aisle
            ...Array.from({ length: 52 }, (_, i) => ({
              x: 100 + i * 20,
              seat: `M${52 - i}`,
              level: 'Premium',
              price: 50,
              className: amethystHover
            }))
          ].map(({ x, seat, level, price, className }, i) => (
            <rect
              key={i}
              x={x}
              y={70}
              width={16}
              height={16}
              className={className}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="65" y="104" fontSize="13" className="text-white font-bold">
            N
          </text>

          {[
            // Premium seats before the aisle
            ...Array.from({ length: 53 }, (_, i) => ({
              x: 80 + i * 20,
              seat: `N${53 - i}`,
              level: 'Premium',
              price: 50,
              className: amethystHover
            }))
          ].map(({ x, seat, level, price, className }, i) => (
            <rect
              key={i}
              x={x}
              y={90}
              width={16}
              height={16}
              className={className}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="45" y="124" fontSize="13" className="text-white font-bold">
            O
          </text>

          {[
            // Premium seats before the aisle
            ...Array.from({ length: 55 }, (_, i) => ({
              x: 60 + i * 20,
              seat: `O${55 - i}`,
              level: 'Premium',
              price: 50,
              className: amethystHover
            }))
          ].map(({ x, seat, level, price, className }, i) => (
            <rect
              key={i}
              x={x}
              y={110}
              width={16}
              height={16}
              className={className}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="65" y="144" fontSize="13" className="text-white font-bold">
            P
          </text>

          {[
            // Premium seats before the aisle
            ...Array.from({ length: 54 }, (_, i) => ({
              x: 80 + i * 20,
              seat: `P${54 - i}`,
              level: 'General',
              price: 35,
              className: forestHover
            }))
          ].map(({ x, seat, level, price, className }, i) => (
            <rect
              key={i}
              x={x}
              y={130}
              width={16}
              height={16}
              className={className}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="45" y="164" fontSize="13" className="text-white font-bold">
            Q
          </text>

          {[
            ...Array.from({ length: 55 }, (_, i) => ({
              x: 60 + i * 20,
              seat: `Q${55 - i}`,
              level: 'General',
              price: 35,
              className: forestHover
            }))
          ].map(({ x, seat, level, price, className }, i) => (
            <rect
              key={i}
              x={x}
              y={150}
              width={16}
              height={16}
              className={className}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="25" y="184" fontSize="13" className="text-white font-bold">
            R
          </text>

          {[
            ...Array.from({ length: 56 }, (_, i) => ({
              x: 40 + i * 20,
              seat: `R${56 - i}`,
              level: 'General',
              price: 35,
              className: forestHover
            }))
          ].map(({ x, seat, level, price, className }, i) => (
            <rect
              key={i}
              x={x}
              y={170}
              width={16}
              height={16}
              className={className}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="5" y="204" fontSize="13" className="text-white font-bold">
            S
          </text>

          {[
            // Premium seats before the aisle
            ...Array.from({ length: 59 }, (_, i) => ({
              x: 20 + i * 20,
              seat: `S${59 - i}`,
              level: 'General',
              price: 35,
              className: forestHover
            }))
          ].map(({ x, seat, level, price, className }, i) => (
            <rect
              key={i}
              x={x}
              y={190}
              width={16}
              height={16}
              className={className}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default SCFNeel2ndHalf
