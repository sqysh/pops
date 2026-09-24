const amethystHover = 'fill-purple-700 hover:fill-purple-600 duration-200' // Slightly lighter
const magentaHover = 'fill-pink-700 hover:fill-pink-600 duration-200' // Slightly lighter
const forestHover = 'fill-lime-600 hover:fill-lime-500 duration-200'

const SCFNeelPACSVG = ({ setNeel }: any) => {
  const onHoverSeat = (e: any) => {
    const target = e.target as SVGElement
    const seat = target.getAttribute('data-seat')
    const price = target.getAttribute('data-price')
    const level = target.getAttribute('data-level')

    setNeel({
      visible: true,
      seat,
      price,
      level
    })
  }

  const onLeaveSeat = () => {
    setNeel({ visible: false, seat: '', price: '', level: '' })
  }
  return (
    <div className="relative w-full">
      <svg width="100%" height="100%" viewBox="0 0 980 160" xmlns="http://www.w3.org/2000/svg" className="fill-current">
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="105" y="12" fontSize="13" className="text-white font-bold">
            A
          </text>

          {[
            ...Array.from({ length: 39 }, (_, i) => ({
              x: 120 + i * 20,
              seat: `A${39 - i}`,
              level: 'General',
              price: 35
            }))
          ].map(({ x, seat, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={0}
              width={16}
              height={16}
              className={forestHover}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="65" y="32" fontSize="13" className="text-white font-bold">
            B
          </text>

          {[
            ...Array.from({ length: 44 }, (_, i) => ({
              x: 80 + i * 20,
              seat: `B${44 - i}`,
              level: 'General',
              price: 35
            }))
          ].map(({ x, seat, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={20}
              width={16}
              height={16}
              className={forestHover}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="45" y="52" fontSize="13" className="text-white font-bold">
            C
          </text>

          {[
            ...Array.from({ length: 45 }, (_, i) => ({
              x: 60 + i * 20,
              seat: `C${45 - i}`,
              level: 'Premium',
              price: 50
            }))
          ].map(({ x, seat, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={40}
              width={16}
              height={16}
              className={level === 'Premium' ? amethystHover : magentaHover}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="45" y="72" fontSize="13" className="text-white font-bold">
            D
          </text>

          {[
            ...Array.from({ length: 6 }, (_, i) => ({
              x: 60 + i * 20,
              seat: `D${45 - i}`,
              level: 'Premium',
              price: 50
            })),
            ...Array.from({ length: 33 }, (_, i) => ({
              x: 180 + i * 20,
              seat: `D${39 - i}`,
              level: 'Ultra',
              price: 65
            })),

            ...Array.from({ length: 6 }, (_, i) => ({
              x: 840 + i * 20,
              seat: `D${6 - i}`,
              level: 'Premium',
              price: 50
            }))
          ].map(({ x, seat, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={60}
              width={16}
              height={16}
              className={level === 'Premium' ? amethystHover : magentaHover}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="25" y="92" fontSize="13" className="text-white font-bold">
            E
          </text>

          {[
            ...Array.from({ length: 6 }, (_, i) => ({
              x: 40 + i * 20,
              seat: `E${46 - i}`,
              level: 'Premium',
              price: 50
            })),
            ...Array.from({ length: 35 }, (_, i) => ({
              x: 160 + i * 20,
              seat: `E${40 - i}`,
              level: 'Ultra',
              price: 65
            })),

            ...Array.from({ length: 5 }, (_, i) => ({
              x: 860 + i * 20,
              seat: `E${5 - i}`,
              level: 'Premium',
              price: 50
            }))
          ].map(({ x, seat, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={80}
              width={16}
              height={16}
              className={level === 'Premium' ? amethystHover : magentaHover}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="25" y="112" fontSize="13" className="text-white font-bold">
            F
          </text>

          {[
            ...Array.from({ length: 4 }, (_, i) => ({
              x: 40 + i * 20,
              seat: `F${46 - i}`,
              level: 'Premium',
              price: 50
            })),
            ...Array.from({ length: 38 }, (_, i) => ({
              x: 120 + i * 20,
              seat: `F${42 - i}`,
              level: 'Ultra',
              price: 65
            })),

            ...Array.from({ length: 4 }, (_, i) => ({
              x: 880 + i * 20,
              seat: `F${4 - i}`,
              level: 'Premium',
              price: 50
            }))
          ].map(({ x, seat, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={100}
              width={16}
              height={16}
              className={level === 'Premium' ? amethystHover : magentaHover}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="24" y="132" fontSize="13" className="text-white font-bold">
            G
          </text>

          {[
            ...Array.from({ length: 4 }, (_, i) => ({
              x: 40 + i * 20,
              seat: `G${47 - i}`,
              level: 'Premium',
              price: 50
            })),
            ...Array.from({ length: 39 }, (_, i) => ({
              x: 120 + i * 20,
              seat: `G${43 - i}`,
              level: 'Ultra',
              price: 65
            })),

            ...Array.from({ length: 4 }, (_, i) => ({
              x: 900 + i * 20,
              seat: `G${4 - i}`,
              level: 'Premium',
              price: 50
            }))
          ].map(({ x, seat, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={120}
              width={16}
              height={16}
              className={level === 'Premium' ? amethystHover : magentaHover}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="0" y="152" fontSize="13" className="text-white font-bold">
            H
          </text>

          {[
            ...Array.from({ length: 4 }, (_, i) => ({
              x: 20 + i * 20,
              seat: `H${48 - i}`,
              level: 'Premium',
              price: 50
            })),
            ...Array.from({ length: 41 }, (_, i) => ({
              x: 100 + i * 20,
              seat: `H${44 - i}`,
              level: 'Ultra',
              price: 65
            })),

            ...Array.from({ length: 3 }, (_, i) => ({
              x: 920 + i * 20,
              seat: `H${3 - i}`,
              level: 'Premium',
              price: 50
            }))
          ].map(({ x, seat, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={140}
              width={16}
              height={16}
              className={level === 'Premium' ? amethystHover : magentaHover}
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

export default SCFNeelPACSVG
