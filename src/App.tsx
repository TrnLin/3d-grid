import React from "react";

const App = () => {
  const grid = React.useMemo(
    () => Array.from({ length: 800 }, (_, i) => i + 1),
    []
  );

  const pastelColors = React.useMemo(
    () => [
      "#FF5733",
      "#FF8D1A",
      "#FFC300",
      "#FF5733",
      "#FF8D1A",
      "#FFC300",
      "#FF5733",
      "#FF8D1A",
      "#FFC300",
      "#FF5733",
      "#FF8D1A",
      "#FFC300",
      "#FF5733",
      "#FF8D1A",
      "#FFC300",
      "#FF5733",
      "#FF8D1A",
      "#FFC300",
      "#FF5733",
      "#FF8D1A",
    ],
    []
  );

  const randomColor = React.useCallback(() => {
    const randomIndex = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[randomIndex];
  }, [pastelColors]);

  const generate2DMap = React.useCallback((grid: number[], cols: number) => {
    const rows = Math.ceil(grid.length / cols);
    const map = [];
    for (let i = 0; i < rows; i++) {
      map.push(grid.slice(i * cols, i * cols + cols));
    }
    return map;
  }, []);

  const grid2D = React.useMemo(
    () => generate2DMap(grid, 40),
    [grid, generate2DMap]
  );
  console.log(grid2D);

  const handleMouseEnter = React.useCallback(
    (row: number, col: number, radius: number = 2) => {
      console.log(`Row: ${row}, Col: ${col}`);
      const positions = [];
      for (let r = -radius; r <= radius; r++) {
        for (let c = -radius; c <= radius; c++) {
          if (Math.abs(r) + Math.abs(c) <= radius) {
            positions.push({ row: row + r, col: col + c });
          }
        }
      }
      positions.forEach((pos) => {
        if (
          pos.row >= 0 &&
          pos.row < grid2D.length &&
          pos.col >= 0 &&
          pos.col < grid2D[0].length
        ) {
          const adjacentBlock = document.querySelector(
            `[data-row="${pos.row}"][data-col="${pos.col}"]`
          ) as HTMLElement;
          if (adjacentBlock) {
            const hoverColor =
              adjacentBlock.style.getPropertyValue("--hover-color");
            adjacentBlock.style.backgroundColor = hoverColor;
            adjacentBlock.style.transform = "translateZ(20px)";
            setTimeout(() => {
              adjacentBlock.style.transform = "translateZ(0px)";
              adjacentBlock.style.backgroundColor = "white";
            }, 300);
          }
        }
      });
    },
    [grid2D]
  );

  const raiseAdjenctBlocks = React.useCallback(
    (e: React.MouseEvent, row: number, col: number, radius: number = 5) => {
      e.preventDefault();
      const positions = [];
      for (let r = -radius; r <= radius; r++) {
        for (let c = -radius; c <= radius; c++) {
          if (Math.abs(r) + Math.abs(c) <= radius) {
            positions.push({ row: row + r, col: col + c });
          }
        }
      }
      positions.sort((a, b) => {
        const distA = Math.abs(a.row - row) + Math.abs(a.col - col);
        const distB = Math.abs(b.row - row) + Math.abs(b.col - col);
        return distA - distB;
      });
      positions.forEach((pos, index) => {
        if (
          pos.row >= 0 &&
          pos.row < grid2D.length &&
          pos.col >= 0 &&
          pos.col < grid2D[0].length
        ) {
          const adjacentBlock = document.querySelector(
            `[data-row="${pos.row}"][data-col="${pos.col}"]`
          ) as HTMLElement;
          if (adjacentBlock) {
            const hoverColor =
              adjacentBlock.style.getPropertyValue("--hover-color");
            setTimeout(() => {
              adjacentBlock.style.backgroundColor = hoverColor;
              adjacentBlock.style.transform = "translateZ(20px)";
              setTimeout(() => {
                adjacentBlock.style.transform = "translateZ(0px)";
                adjacentBlock.style.backgroundColor = "white";
              }, 300);
            }, index * 20);
          }
        }
      });
    },
    [grid2D]
  );

  return (
    <>
      <section className='w-screen grid place-items-center'>
        <div className='w-[80vw] h-[80vh] relative  overflow-hidden rounded-xl ring-2 ring-black  '>
          <div className='vignette'></div>
          <div className='grid w-[110vw]  grid-cols-[repeat(40,minmax(0,1fr))] slap-container absolute top-1/2 left-1/2'>
            {grid2D.map((row, rowIndex) =>
              row.map((_, colIndex) => {
                const color = randomColor();
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{ "--hover-color": color } as React.CSSProperties}
                    className={`slap hover:hover-slap`}
                    data-row={rowIndex}
                    data-col={colIndex}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                      raiseAdjenctBlocks(e, rowIndex, colIndex)
                    }
                  >
                    {/* {rowIndex}-{colIndex} */}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className='h-screen w-screen'></section>
    </>
  );
};

export default App;
