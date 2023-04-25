//HEATMAP
d3.dsv(';','../data/147_18-24_agosto.csv', d3.autoType).then(data => {
    console.log(data);

    const total = data.length;

    console.log('total', total)

    const reclamosPorBarrio = d3.group(data, d => d.domicilio_barrio) // crea un Map
    console.log('reclamosPorBarrio', reclamosPorBarrio)

    const newBarrioMap = new Map(
      [...reclamosPorBarrio].map(([barrio, array]) => [barrio, array.length])
    );
    
    console.log('newBarrioMap',newBarrioMap);


    const reclamosPorBarrioYCanal = d3.group(data, d => d.domicilio_barrio, d => d.canal) // crea un Map
    

    const canalesPosibles = ["App BA 147", "GCS Web", "Boti", "Operador UGIS", "Operador GCBA", "Mail 147", "Comuna", "App Denuncia Vial"];

    for (const [barrio, canales] of reclamosPorBarrioYCanal) {
      for (const canal_posible of canalesPosibles) {
        if (!canales.has(canal_posible)) {
          canales.set(canal_posible, []);
        }
      }
    }

    console.log('reclamosPorBarrioYCanal', reclamosPorBarrioYCanal)

    const reclamosArray = [];

    reclamosPorBarrioYCanal.forEach((value, key) => {
      value.forEach((count, canal) => {
        const prop = newBarrioMap.get(key)
        reclamosArray.push({
          barrio: key,
          canal: canal,
          cantidad: count.length,
          proporcion: (count.length/prop)*100
        });
      });
    });
    
    console.log("reclamosArray",reclamosArray);


    const contador = {};

    reclamosArray.forEach((objeto) => {
      const barrio = objeto.barrio;
      const cantidad = objeto.cantidad;
      
      if (!contador[barrio]) {
        contador[barrio] = cantidad;
      } else {
        contador[barrio] += cantidad;
      }
    });

    console.log('contador',contador)

    const valores = Object.values(contador); //encontrar la mediana
    valores.sort((a, b) => a - b);
    let mediana;
    const mitad = Math.floor(valores.length / 2);
    if (valores.length % 2 === 0) {
      mediana = (valores[mitad - 1] + valores[mitad]) / 2;
    } else {
      mediana = valores[mitad];
    }

    const reclamosArrayFiltrados = [];

    reclamosArray.forEach((objeto) => {
      if (contador[objeto.barrio]>mediana) {
        reclamosArrayFiltrados.push({
          barrio: objeto.barrio,
          canal: objeto.canal,
          cantidad: objeto.cantidad,
          proporcion: objeto.proporcion
        });
      }
    });

    const datosFiltrados = reclamosArrayFiltrados.filter((dato) => dato.barrio !== null);
    console.log('datosFiltrados', datosFiltrados)

    function containsWhitespace(str) {
      return /\s/.test(str);
    }

   let chart = Plot.plot({
        marks:[
        Plot.cell(datosFiltrados, {
          x: d=>d.barrio,
          y: d=>d.canal.toUpperCase(),
          fill: 'proporcion',
          title: d => `${d.barrio}\n${d.cantidad} de reclamos con ${d.canal.toUpperCase()}`
        }),
        //d=>d.barrio.toLowerCase().charAt(0).toUpperCase() + d.barrio.slice(1).toLowerCase()

        Plot.axisX({
          label: null,
          tickSize: 0,
          tickRotate:-45,
          fontWeight: '550',
          fontSize: '20',
        }),

        Plot.axisY({
          label: null,
          tickSize: 0,
          fontWeight: '550',
          fontSize: '20',
        }),
        ],

    // x:{
    //   tickRotate:-45,
    //   tickSize:0,
    //   tickPadding: 3,
    // },

    marginLeft:210,
    marginBottom:200,
    width:1700,
    height:730,
    color:{
        
        range:[0.25,1],
        scheme:'YlGnBu',
        //domain:[0,1],
    },
    
    })
    d3.select('#heatMap').append(() => chart)
  })
  
  d3.dsv(';', '')