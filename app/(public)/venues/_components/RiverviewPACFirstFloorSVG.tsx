'use client'

const amethystHover = 'fill-purple-700 hover:fill-purple-600 duration-200' // Slightly lighter
const magentaHover = 'fill-pink-700 hover:fill-pink-600 duration-200' // Slightly lighter
const forestHover = 'fill-lime-600 hover:fill-lime-500 duration-200'
const tealHover = 'fill-blue-600 hover:fill-blue-500 duration-200' // Slightly lighter

const RiverviewPACFirstFloorSVG = ({ setRiverview }: any) => {
  const onHoverSeat = (e: any) => {
    const target = e.target as SVGElement
    const seat = target.getAttribute('data-seat')
    const price = target.getAttribute('data-price')
    const level = target.getAttribute('data-level')

    setRiverview({
      visible: true,
      seat,
      price,
      level
    })
  }

  const onLeaveSeat = () => {
    setRiverview({ visible: false, seat: '', x: 0, y: 0, price: '', level: '' })
  }

  return (
    <div className="relative w-full">
      <svg width="100%" height="100%" viewBox="0 0 960 420" xmlns="http://www.w3.org/2000/svg" className="fill-current">
        {/* Row A */}
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="204" y="22" fontSize="13" className="text-white font-bold">
            A
          </text>
          {Array.from({ length: 29 }, (_, i) => {
            const seatNumber = 29 - i
            const x = 220 + i * 20
            return (
              <rect
                key={`A${seatNumber}`}
                x={x}
                y="10"
                width="16"
                height="16"
                className={forestHover}
                data-price="35"
                data-seat={`A${seatNumber}`}
                data-level="General"
              />
            )
          })}
        </g>

        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="188" y="43" width="16" height="16" fontSize="13" className="text-white font-bold">
            B
          </text>

          {[...Array(30)].map((_, i) => {
            const seatNumber = 30 - i
            const x = 200 + i * 20

            return (
              <rect
                key={seatNumber}
                x={x}
                y="30"
                width="16"
                height="16"
                className={forestHover}
                data-price="35"
                data-seat={`B${seatNumber}`}
                data-level="General"
              />
            )
          })}
        </g>

        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="188" y="63" width="16" height="16" fontSize="13" className="text-white font-bold">
            C
          </text>

          {[...Array(30)].map((_, i) => {
            const seatNumber = 30 - i
            const x = 200 + i * 20

            return (
              <rect
                key={seatNumber}
                x={x}
                y="50"
                width="16"
                height="16"
                className={forestHover}
                data-price="35"
                data-seat={`C${seatNumber}`}
                data-level="General"
              />
            )
          })}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="244" y="83" width="16" height="16" fontSize="13" className="text-white font-bold">
            D
          </text>
          {Array.from({ length: 23 }).map((_, i) => {
            const seatNumber = 23 - i
            return (
              <rect
                key={seatNumber}
                x={260 + i * 20}
                y={70}
                width="16"
                height="16"
                className={magentaHover}
                data-price="65"
                data-seat={`D${seatNumber}`}
                data-level="Ultra"
              />
            )
          })}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="144" y="103" fontSize="13" className="text-white font-bold">
            E
          </text>
          {Array.from({ length: 31 }).map((_, i) => {
            // Determine group: right 4, middle 23, left 4
            let groupOffset = 0
            if (i < 4) {
              // Right 4 seats
              groupOffset = i
            } else if (i < 27) {
              // Middle 23 seats (after right aisle)
              groupOffset = i + 1 // +1 to account for aisle after seat 4
            } else {
              // Final 4 seats (after second aisle)
              groupOffset = i + 2 // +2 to account for both aisles
            }

            const shiftRight = 80 // 4 squares * 20px
            const x = 720 - groupOffset * 20 + shiftRight

            return (
              <rect
                key={i}
                x={x}
                y={90}
                width="16"
                height="16"
                className={magentaHover}
                data-price="65"
                data-seat={`E${i + 1}`}
                data-level="Ultra"
              />
            )
          })}
        </g>

        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="124" y="123" fontSize="13" className="text-white font-bold">
            F
          </text>

          {[
            // Premium seats before the aisle
            ...Array.from({ length: 3 }, (_, i) => ({
              x: 140 + i * 20,
              seat: `F${33 - i}`,
              level: 'Premium',
              price: 50
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              x: 200 + i * 20,
              seat: `F${31 - i}`,
              level: 'Ultra',
              price: 65
            })),

            // Ultra seats
            ...Array.from({ length: 23 }, (_, i) => ({
              x: 260 + i * 20,
              seat: `F${28 - i}`,
              level: 'Ultra',
              price: 65
            })),
            // Premium seats after the aisle
            ...Array.from({ length: 2 }, (_, i) => ({
              x: 740 + i * 20,
              seat: `F${5 - i}`,
              level: 'Ultra',
              price: 65
            })),
            // Premium seats after the aisle
            ...Array.from({ length: 3 }, (_, i) => ({
              x: 780 + i * 20,
              seat: `F${3 - i}`,
              level: 'Premium',
              price: 50
            }))
          ].map(({ x, seat, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={110}
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
          <text x="104" y="143" fontSize="13" className="text-white font-bold">
            G
          </text>

          {[
            // Premium seats before the aisle
            ...Array.from({ length: 4 }, (_, i) => ({
              x: 120 + i * 20,
              seat: `G${35 - i}`, // G35, G33, G31, G29
              level: 'Premium',
              price: 50
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              x: 200 + i * 20,
              seat: `G${33 - i}`, // G35, G33, G31, G29
              level: 'Ultra',
              price: 65
            })),
            // Ultra seats before the aisle
            ...Array.from({ length: 23 }, (_, i) => ({
              x: 260 + i * 20,
              seat: `G${28 - i}`, // G28 down to G6
              level: 'Ultra',
              price: 65
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              x: 740 + i * 20,
              seat: `G${6 - i}`, // G35, G33, G31, G29
              level: 'Ultra',
              price: 65
            })),
            // Premium seats after the aisle
            ...Array.from({ length: 4 }, (_, i) => ({
              x: 780 + i * 20,
              seat: `G${4 - i}`, // G5, G4, G3
              level: 'Premium',
              price: 50
            }))
          ].map(({ x, seat, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={130}
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
          <text x="84" y="163" fontSize="13" className="text-white font-bold">
            H
          </text>

          {[
            // Premium seats before the aisle
            ...Array.from({ length: 5 }, (_, i) => ({
              x: 100 + i * 20,
              seat: `H${37 - i}`, // H37 to H33
              level: 'Premium',
              price: 50
            })),

            // Ultra seats before the aisle
            ...Array.from({ length: 2 }, (_, i) => ({
              x: 200 + i * 20,
              seat: `H32 - ${i}`, // H32, H31
              level: 'Ultra',
              price: 65
            })),

            // Ultra seats in the middle
            ...Array.from({ length: 23 }, (_, i) => ({
              x: 260 + i * 20,
              seat: `H${30 - i}`, // H30 to H10
              level: 'Ultra',
              price: 65
            })),

            ...Array.from({ length: 2 }, (_, i) => ({
              x: 740 + i * 20,
              seat: `H${9 - i}`, // H9 to H6
              level: 'Ultra',
              price: 65
            })),

            // Premium seats after the aisle
            ...Array.from({ length: 5 }, (_, i) => ({
              x: 780 + i * 20,
              seat: `H${5 - i}`, // H5 to H1
              level: 'Premium',
              price: 50
            }))
          ].map(({ x, seat, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={150}
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
          <text x="47" y="183" fontSize="13" className="text-white font-bold">
            I
          </text>

          {[
            // Left Premium block
            ...Array.from({ length: 7 }, (_, i) => ({
              x: 60 + i * 20,
              seat: `I${41 - i}`,
              price: 50,
              level: 'Premium',
              className: amethystHover
            })),

            // Left Ultra block
            ...Array.from({ length: 2 }, (_, i) => ({
              x: 200 + i * 20,
              seat: `I${34 - i}`,
              price: 65,
              level: 'Ultra',
              className: magentaHover
            })),

            // Middle Ultra block (after aisle)
            ...Array.from({ length: 23 }, (_, i) => ({
              x: 260 + i * 20,
              seat: `I${32 - i}`,
              price: 65,
              level: 'Ultra',
              className: magentaHover
            })),

            // Right Ultra block (after aisle)
            ...Array.from({ length: 2 }, (_, i) => ({
              x: 740 + i * 20,
              seat: `I${9 - i}`,
              price: 65,
              level: 'Ultra',
              className: magentaHover
            })),

            // Right Premium block
            ...Array.from({ length: 7 }, (_, i) => ({
              x: 780 + i * 20,
              seat: `I${7 - i}`,
              price: 50,
              level: 'Premium',
              className: amethystHover
            }))
          ].map(({ x, seat, price, level, className }) => (
            <rect
              key={seat}
              x={x}
              y="170"
              width="16"
              height="16"
              className={className}
              data-price={price}
              data-seat={seat}
              data-level={level}
            />
          ))}
        </g>

        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="25" y="202" fontSize="13" className="text-white font-bold">
            J
          </text>
          {[
            // Left Premium
            ...Array.from({ length: 8 }, (_, i) => ({
              seat: `J${43 - i}`,
              x: 40 + i * 20,
              level: 'Premium',
              price: 50
            })),
            // Left Ultra
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `J${35 - i}`,
              x: 200 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Ultra (after aisle)
            ...Array.from({ length: 23 }, (_, i) => ({
              seat: `J${33 + i}`,
              x: 260 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `J${10 + i}`,
              x: 740 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Premium
            ...Array.from({ length: 8 }, (_, i) => ({
              seat: `J${8 - i}`,
              x: 780 + i * 20,
              level: 'Premium',
              price: 50
            }))
          ].map(({ seat, x, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={190}
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
          <text x="5" y="224" fontSize="13" className="text-white font-bold">
            K
          </text>
          {[
            // Left Premium
            ...Array.from({ length: 9 }, (_, i) => ({
              seat: `K${45 - i}`,
              x: 20 + i * 20,
              level: 'Premium',
              price: 50
            })),
            // Left Ultra
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `K${36 - i}`,
              x: 200 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Ultra (after aisle)
            ...Array.from({ length: 23 }, (_, i) => ({
              seat: `K${34 - i}`,
              x: 260 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Ultra (close to the aisle)
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `K${11 - i}`,
              x: 740 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Premium
            ...Array.from({ length: 9 }, (_, i) => ({
              seat: `K${9 - i}`,
              x: 780 + i * 20,
              level: 'Premium',
              price: 50
            }))
          ].map(({ seat, x, level, price }) => (
            <rect
              key={seat}
              x={x}
              y={210}
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
          <text x="5" y="244" fontSize="13" className="text-white font-bold">
            L
          </text>
          {[
            // Left Premium
            ...Array.from({ length: 9 }, (_, i) => ({
              seat: `L${45 - i}`,
              x: 20 + i * 20,
              level: 'Premium',
              price: 50
            })),
            // Left Ultra
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `L${36 - i}`,
              x: 200 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Ultra (after aisle)
            ...Array.from({ length: 23 }, (_, i) => ({
              seat: `L${34 - i}`,
              x: 260 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Ultra (close to the aisle)
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `L${11 - i}`,
              x: 740 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Premium
            ...Array.from({ length: 9 }, (_, i) => ({
              seat: `L${9 - i}`,
              x: 780 + i * 20,
              level: 'Premium',
              price: 50
            }))
          ].map(({ seat, x, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={230}
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
          <text x="5" y="264" fontSize="13" className="text-white font-bold">
            M
          </text>
          {[
            // Left Premium
            ...Array.from({ length: 9 }, (_, i) => ({
              seat: `M${45 - i}`,
              x: 20 + i * 20,
              level: 'Premium',
              price: 50
            })),
            // Left Ultra
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `M${36 - i}`,
              x: 200 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Ultra (after aisle)
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `M${34 - i}`,
              x: 260 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            ...Array.from({ length: 19 }, (_, i) => ({
              seat: `M${34 - i}`,
              x: 300 + i * 20,
              level: 'Premium',
              price: 50
            })),
            // Right Ultra (close to the aisle)
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `M${11 - i}`,
              x: 680 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `M${11 - i}`,
              x: 740 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Premium
            ...Array.from({ length: 9 }, (_, i) => ({
              seat: `M${9 - i}`,
              x: 780 + i * 20,
              level: 'Premium',
              price: 50
            }))
          ].map(({ seat, x, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={250}
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
          <text x="25" y="284" fontSize="13" className="text-white font-bold">
            N
          </text>
          {[
            // Left Premium
            ...Array.from({ length: 8 }, (_, i) => ({
              seat: `N${43 - i}`,
              x: 40 + i * 20,
              level: 'Premium',
              price: 50
            })),
            // Left Ultra
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `N${35 - i}`,
              x: 200 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Ultra (after aisle)
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `N${33 - i}`,
              x: 260 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            ...Array.from({ length: 19 }, (_, i) => ({
              seat: `N${31 - i}`,
              x: 300 + i * 20,
              level: 'Premium',
              price: 50
            })),
            // Right Ultra (close to the aisle)
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `N${12 - i}`,
              x: 680 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `N${10 - i}`,
              x: 740 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Premium
            ...Array.from({ length: 8 }, (_, i) => ({
              seat: `N${8 - i}`,
              x: 780 + i * 20,
              level: 'Premium',
              price: 50
            }))
          ].map(({ seat, x, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={270}
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
          <text x="45" y="304" fontSize="13" className="text-white font-bold">
            O
          </text>
          {[
            // Left Premium
            ...Array.from({ length: 4 }, (_, i) => ({
              seat: `O${36 - i}`,
              x: 60 + i * 20,
              level: 'Premium',
              price: 50
            })),
            // Left Ultra
            ...Array.from({ length: 5 }, (_, i) => ({
              seat: `O${32 - i}`,
              x: 140 + i * 20,
              level: 'Wheelchair',
              price: 35
            })),
            // Right Ultra (after aisle)
            ...Array.from({ length: 18 }, (_, i) => ({
              seat: `O${27 - i}`,
              x: 320 + i * 20,
              level: 'Wheelchair',
              price: 35
            })),
            ...Array.from({ length: 5 }, (_, i) => ({
              seat: `O${9 - i}`,
              x: 740 + i * 20,
              level: 'Wheelchair',
              price: 35
            })),
            // Right Ultra (close to the aisle)
            ...Array.from({ length: 4 }, (_, i) => ({
              seat: `O${4 - i}`,
              x: 840 + i * 20,
              level: 'Premium',
              price: 50
            }))
          ].map(({ seat, x, level, price }) => (
            <rect
              key={seat}
              x={x}
              y={290}
              width={16}
              height={16}
              className={level === 'Premium' ? amethystHover : tealHover}
              data-seat={seat}
              data-level={level}
              data-price={price}
            />
          ))}
        </g>
        <g onMouseEnter={onHoverSeat} onMouseLeave={onLeaveSeat}>
          <text x="25" y="344" fontSize="13" className="text-white font-bold">
            P
          </text>
          {[
            // Left Premium
            ...Array.from({ length: 6 }, (_, i) => ({
              seat: `P${40 - i}`,
              x: 40 + i * 20,
              level: 'Premium',
              price: 50
            })),
            // Left Ultra
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `P${34 - i}`,
              x: 160 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `P${32 - i}`,
              x: 260 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Ultra (after aisle)
            ...Array.from({ length: 20 }, (_, i) => ({
              seat: `P${30 - i}`,
              x: 300 + i * 20,
              level: 'Premium',
              price: 50
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `P${10 - i}`,
              x: 700 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `P${8 - i}`,
              x: 760 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Ultra (close to the aisle)
            ...Array.from({ length: 6 }, (_, i) => ({
              seat: `P${6 - i}`,
              x: 800 + i * 20,
              level: 'Premium',
              price: 50
            }))
          ].map(({ seat, x, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={330}
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
          <text x="25" y="364" fontSize="13" className="text-white font-bold">
            Q
          </text>
          {[
            // Left Premium
            ...Array.from({ length: 6 }, (_, i) => ({
              seat: `Q${40 - i}`,
              x: 40 + i * 20,
              level: 'Premium',
              price: 50
            })),
            // Left Ultra
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `Q${34 - i}`,
              x: 160 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `Q${32 - i}`,
              x: 240 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Ultra (after aisle)
            ...Array.from({ length: 21 }, (_, i) => ({
              seat: `Q${30 - i}`,
              x: 280 + i * 20,
              level: 'Premium',
              price: 50
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `Q${10 - i}`,
              x: 700 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            ...Array.from({ length: 2 }, (_, i) => ({
              seat: `Q${8 - i}`,
              x: 760 + i * 20,
              level: 'Ultra',
              price: 65
            })),
            // Right Ultra (close to the aisle)
            ...Array.from({ length: 6 }, (_, i) => ({
              seat: `Q${6 - i}`,
              x: 800 + i * 20,
              level: 'Premium',
              price: 50
            }))
          ].map(({ seat, x, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={350}
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
          <text x="45" y="384" fontSize="13" className="text-white font-bold">
            R
          </text>
          {[
            ...Array.from({ length: 7 }, (_, i) => ({
              seat: `R${40 - i}`,
              x: 60 + i * 20,
              level: 'General',
              price: 35
            })),
            ...Array.from({ length: 26 }, (_, i) => ({
              seat: `R${33 - i}`,
              x: 220 + i * 20,
              level: 'General',
              price: 35
            })),
            ...Array.from({ length: 7 }, (_, i) => ({
              seat: `R${7 - i}`,
              x: 760 + i * 20,
              level: 'General',
              price: 35
            }))
          ].map(({ seat, x, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={370}
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
          <text x="45" y="404" fontSize="13" className="text-white font-bold">
            S
          </text>
          {[
            ...Array.from({ length: 7 }, (_, i) => ({
              seat: `S${40 - i}`,
              x: 60 + i * 20,
              level: 'General',
              price: 35
            })),
            ...Array.from({ length: 26 }, (_, i) => ({
              seat: `S${33 - i}`,
              x: 220 + i * 20,
              level: 'General',
              price: 35
            })),
            ...Array.from({ length: 7 }, (_, i) => ({
              seat: `S${7 - i}`,
              x: 760 + i * 20,
              level: 'General',
              price: 35
            }))
          ].map(({ seat, x, level, price }, i) => (
            <rect
              key={i}
              x={x}
              y={390}
              width={16}
              height={16}
              className={forestHover}
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

export default RiverviewPACFirstFloorSVG
