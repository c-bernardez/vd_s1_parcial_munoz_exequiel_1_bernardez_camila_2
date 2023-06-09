//TIMELINE
d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

d3.dsv(';','https://c-bernardez.github.io/vd_s1_parcial_munoz_exequiel_1_bernardez_camila_2//data/147_18-24_agosto.csv', d3.autoType).then(data => {

const cierre = d3.group(data, d=>d.fecha_cierre_contacto) //guardo todas las fechas de cierre
    
const parser = d3.timeParse('%d/%m/%Y'); //creo el parser de fecha

let maxima_fecha = parser("01/01/1970");
for (let key of cierre.keys()) { //encuentro la fecha de cierre mas alta
  if (key !== null && ( parser(key) > maxima_fecha)) {
    maxima_fecha = parser(key);
  }
}
maxima_fecha.setDate(maxima_fecha.getDate() + 3) //le agrego 30 dias a la fecha maxima para desplazar el promedio a favor de "no cerrado"

const maxima_fecha_str = maxima_fecha.toLocaleDateString("es-AR"); //convierto la fecha al formato dd/mm/aaaa
console.log('maxima_fecha',maxima_fecha_str);

cierre.set(maxima_fecha_str, cierre.get(null));
cierre.delete(null); //reemplazo los casos abiertos con mi fecha invetada
console.log('cierre',cierre) 


const fechasInicio = d3.group(data, d => d.canal, d => d.fecha_ingreso) //mapeo canales a fecha de ingreso de un reclamo
console.log('fechasInicio',fechasInicio)


const promediosPonderadosFechasInicio = new Map(); //mapeo canales a fecha de inicio promedio
for (const [clave, valores] of fechasInicio) {
  let totalCantidad = 0;
  let sumaPonderadaFechas = 0;
  for (const [fecha, reclamos] of valores) {
    cantidad = reclamos.length 
    if (fecha !== null && cantidad > 0) {
      const fechaObj = d3.timeParse('%d/%m/%Y')(fecha);
      totalCantidad += cantidad;
      sumaPonderadaFechas += fechaObj.getTime() * cantidad;
    }
  }

  const fechaPromedioPonderado = new Date(Math.round(sumaPonderadaFechas / totalCantidad));
  promediosPonderadosFechasInicio.set(clave, fechaPromedioPonderado);
}

console.log('promediosPonderadosFechasInicio',promediosPonderadosFechasInicio)

// const dataF = data.filter(d=>d.fecha_cierre_contacto!=null);

const fechasCierre = d3.group(data, d => d.canal, d => d.fecha_cierre_contacto ?? maxima_fecha_str) //mapeo canales a fecha de cierre de un reclamo
console.log('fechasCierre',fechasCierre)

const promediosPonderadosFechasCierre = new Map(); //mapeo canales a fecha de cierre promedio
for (const [clave, valores] of fechasCierre) {
  let totalCantidad = 0;
  let sumaPonderadaFechas = 0;
  for (const [fecha, reclamos] of valores) {
    cantidad = reclamos.length 
    if (fecha !== null && cantidad > 0) {
      const fechaObj = d3.timeParse('%d/%m/%Y')(fecha);
      totalCantidad += cantidad;
      sumaPonderadaFechas += fechaObj.getTime() * cantidad;
    }
  }

  const fechaPromedioPonderado = new Date(Math.round(sumaPonderadaFechas / totalCantidad));
  promediosPonderadosFechasCierre.set(clave, fechaPromedioPonderado);
}

console.log('promediosPonderadosFechasCierre',promediosPonderadosFechasCierre)


const fechasArray = []; //array para guardar la fecha de inicio y cierre promedio por canal

promediosPonderadosFechasInicio.forEach((value, key) => {
  //agregamos el canal y la fecha de inicio
    fechasArray.push({
      canal: key,
      fecha: value,
  });
});

promediosPonderadosFechasCierre.forEach((value, key) => {
  //agregamos el canal y la fecha de inicio/cierre
    fechasArray.push({
      canal: key,
      fecha: value,
  });
});

const reclamosPorCanal = d3.group(data, d => d.canal)
console.log('reclamosPorCanal',reclamosPorCanal)

fechasArray.forEach(obj => {
  const canal = obj.canal;
  const fechaCierre = reclamosPorCanal.get(canal);
  obj.cantidad = fechaCierre.length;
});

console.log("fechasArray",fechasArray);

// const firstOccurrences = fechasArray.reduce((acc, obj) => {
//   if (!acc[obj.canal]) {
//     // Si este canal aún no está en el objeto de acumulación, agregarlo.
//     acc[obj.canal] = obj;
//   } else {
//     // Si ya está en el objeto de acumulación, actualizarlo solo si es anterior al actual objeto.
//     if (obj.fecha < acc[obj.canal].fecha) {
//       acc[obj.canal] = obj;
//     }
//   }
//   return acc;
// }, {});
// console.log('firstOccurrences',firstOccurrences)

const ini = Date.parse('20 Aug 2021');
const mid = Date.parse('30 Aug 2021');
const fin = Date.parse('5 Sep 2021');    
const timestamp = Date.parse('22 Aug 2021'); //lo uso mas tarde para solo poner el texto en la fecha max

const ancho = 1500;





let chart = Plot.plot({
    marks:[
      Plot.barX(
        fechasArray,
        Plot.groupY(
          {
            x1: 'min',
            x2: 'max',
          },
          { x: d=>d.fecha, 
          y: 'canal' , 
          fill: d => {
            if (d.canal === 'Operador UGIS') {
              return '#369EBD';
            } else if (d.canal === 'App Denuncia Vial') {
              return '#7BD4BA';
            } else {
              return '#B7B7B7';
            }
          },
          title: d => `${Math.round((promediosPonderadosFechasCierre.get(d.canal).getTime()-promediosPonderadosFechasInicio.get(d.canal).getTime())*(1.1574*10**(-8))) } días`,
          }
        )),

      // Plot.text(
      //   fechasArray.filter(d=>d.fecha.getTime()>timestamp),{
      //   x: d => new Date(d.fecha.getTime() + (3 * 60 * 60 * 1000)), 
      //   y: d => d.canal, 
      //   text: d => d.canal, 
      //   fill: d => d.canal, 
      //   textAnchor: 'start', 
      //   fontWeight: '450',
      //   fontSize: 20,
      //   }),

      Plot.axisX({
        type: 'time',
        label: null,
        tickSize: 0,
        //ticks:([ini,mid,fin]),
        ticks:([]),
        tickFormat: d => d3.timeFormat('%-d/ %-m')(d),
        fontWeight: '500',
        textAnchor: 'start',
        fontSize: '17',
        anchor: 'top',
      }),

      // Plot.gridX({
      //   {x: (y) => fechasArray.find((d) => d.fecha >= y)? d.canal, insetLeft: -6}
      // }),

      Plot.text( //plot UGIS
        fechasArray.filter(d=>d.fecha.getTime()>timestamp && d.canal=='Operador UGIS'),{
        x: d => new Date(d.fecha.getTime() - (10 * 60 * 60 * 1000)), 
        y: d => d.canal, 
        text: d => d.canal.split(' ')[1], 
        fill: 'white', 
        textAnchor: 'end', 
        fontWeight: '480',
        fontSize: 43,
        }),

      Plot.text( //plot fechas inicio
        fechasArray.filter(d=>d.fecha.getTime()<timestamp && (d.canal=='Operador UGIS'||d.canal=='App Denuncia Vial')),{
        x: d => new Date(d.fecha.getTime() - (5 * 60 * 60 * 1000)), 
        y: d => d.canal, 
        text: d => d3.timeFormat('%d %b')(d.fecha).toUpperCase(), 
        fill: d => {
          if (d.canal === 'Operador UGIS') {
            return '#55A7BF';
          } else if (d.canal === 'App Denuncia Vial') {
            return '#95CCBC';
          } 
        },
        textAnchor: 'end', 
        fontWeight: '500',
        fontSize: 43,
        }),

      Plot.text( //plot fechas cieere
        fechasArray.filter(d=>d.fecha.getTime()>timestamp && (d.canal=='Operador UGIS'||d.canal=='App Denuncia Vial')),{
        x: d => new Date(d.fecha.getTime() +(5 * 60 * 60 * 1000)), 
        y: d => d.canal, 
        text: d => d3.timeFormat('%d %b')(d.fecha).toUpperCase(), 
        fill: d => {
          if (d.canal === 'Operador UGIS') {
            return '#55A7BF';
          } else if (d.canal === 'App Denuncia Vial') {
            return '#95CCBC';
          } 
        },
        textAnchor: 'start', 
        fontWeight: '500',
        fontSize: 43,
        }),


      Plot.axisY({
        label:null,
        fontWeight: '480',
        fontSize: '43',
        tickSize:0,
        ticks:(["App BA 147", "GCS Web", "Boti", , "Operador GCBA", "Mail 147", "Comuna", "App Denuncia Vial"]),
        textAnchor: 'start',
        dx: 160,
        fill:"white",
      }),

    ],

x:{
  type: 'time'
},
nice:true,
height:900,
width:1300,
marginLeft:70,
marginRight:30,
color:{
    //legend:true,
    scheme:'YlGnBu',
    range:[0.2,1],
},

})
d3.select('#timeline').append(() => chart)
})

d3.dsv(';', '')