//MAPA

const mapaFetch = d3.json('./scripts/barrios-caba.geojson')
const dataFetch = d3.dsv(';', 'https://c-bernardez.github.io/vd_s1_parcial_munoz_exequiel_1_bernardez_camila_2//data/147_18-24_agosto.csv', d3.autoType)

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  
  /* Agrupamos reclamos x barrio */
  const reclamosPorBarrio = d3.group(data, d => d.domicilio_barrio, d => d.canal) // crea un Map
  console.log('reclamosPorBarrio', reclamosPorBarrio)

  const mayorCantidadPorBarrio = new Map();

  for (const [barrio, canales] of reclamosPorBarrio) {
    let canalConMayorCantidad = null;
    let mayorCantidad = 0;
    
    for (const [canal, reclamos] of canales) {
      const cantidad = reclamos.length;
      if (cantidad > mayorCantidad) {
        canalConMayorCantidad = canal;
        mayorCantidad = cantidad;
      }
    }
    
    canalElegido = new Map();
    canalElegido.set(canalConMayorCantidad, mayorCantidad);
    mayorCantidadPorBarrio.set(barrio, canalElegido);
  }

  console.log('mayorCantidadPorBarrio',mayorCantidadPorBarrio);
    // mayorCantidadPorBarrio.set(barrio, { [canalConMayorCantidad]: canales.get(canalConMayorCantidad).length });


  /* Mapa Coroplético */
  let chartMap = Plot.plot({
    // https://github.com/observablehq/plot#projection-options
    projection: {
      type: 'mercator',
      domain: barrios, // Objeto GeoJson a encuadrar
    },
    height:300,
    width:300,
    color: {
      // Quantize continuo (cant. denuncias) -> discreto (cant. colores)
      type: 'categorical', 
      //scheme: 'Plasma',
      // range:[
      //   '#2A2F4F',
      //   '#FDE2F3',
      //   '#917FB3',
      //   '#E5BEEC'
      // ],
      
      range:[0.2,0.55],
      scheme:'YlGnBu',
      //domain:[0,1],
      label: 'Canal',
    },
    marks: [
      Plot.geo(barrios, {
        fill: d => {
          let nombreBarrio = d.properties.BARRIO;
          let canalMasUsado = mayorCantidadPorBarrio.get(nombreBarrio).keys().next().value;
          return canalMasUsado;
        },
        
        stroke: 'white',
        strokeWidth:1,
        title: d => `${d.properties.BARRIO}\n${mayorCantidadPorBarrio.get(d.properties.BARRIO).values().next().value} reclamos con ${mayorCantidadPorBarrio.get(d.properties.BARRIO).keys().next().value}`,
      }),
    ],
    
  })

  /* Agregamos al DOM la visualización chartMap */
  d3.select('#chartMap').append(() => chartMap)
})