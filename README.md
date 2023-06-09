# Parcial - Muñoz Exequiel, Bernardez Camila - VD, S1

## **hilo narrativo de los gráficos presentados:** 
nos interesaba ver los canales que usan los porteños para realizar sus reclamos. 
en particular nos centramos en ver que canales son más utilizados en cada barrio, cuánto uso se les da a los demás que no eran el favorito, y cuánto tiempo (en promedio) tardan en cerrarse los casos según el canal utilizado. 

encontramos que los 4 canales más utilizados son App BA 147, GCS Web, Operador UGIS y App Denuncia Vial (aunque estos 2 eran los favoritos de pocos barrios). a pesar de que estos son los favoritos, en la mayoría de los barrios no había grandes diferencias de uso entre ellos, a excepción de Villa Lugano y Barracas que le dan un uso excesivo al Operador UGIS. Boti también es bastante utilizado, a pesar de no liderar ningún barrio, mientras que Mail 147, Operador GCBA y Comuna no son canales frecuentes en ningún barrio porteño.


## **los problemas con los que se enfrentaron con el conjunto de datos:** 
los problemas en general tuvieron que ver con la necesidad de manejar los datos a nuestro gusto, ya que la forma en la que estaban presentados no nos resultaba útil. también hubo que hacer un cierto trabajo para lograr usar las marcas de texto apropiadamente. el gráfico de barras fue particularmente desafiante porque hubo que manipular bastante los datos, y trabajar con fechas y objetos Date fue complicado

## **cómo lograron solucionarlos:** 
para los problemas relacioandos con el manejo de datos, en general lo solucionamos con ciclos que creaban mapas con las claves y valores que nos interesaban, y a partir de ellos creamos arrays de objetos con las propiedades que nos interesaban para los ejes, los textos, los tooltip y el fill, a fin de que la función plot pudiera trabajar con ellos.

con el tema de los textos encontramos varias soluciones. la primera y la más sencilla fue usar el eje 'y', y desplazar los labels de los canales hacia la derecha. por como quedaba nuestro gráfico esto no iba a ser útil para el Operador UGIS por tener un label muy largo, así que ahí decidimos usar el mismo array filtrado para incluirlo solo a él, y usar funciones de javascript para quedarnos únicamente con la palabra 'UGIS'.

en cuanto a las fechas, usamos timeParse para pasar de los formatos dd/mm/aaaa a objetos fechas, y getTime() para poder operar con ellas y calcular promedios ponderados. 

## **las marcas y canales utilizados:**
*mapa:* para representar el canal más utilizado en cada barrio nos pareció lo más apropiado usar un mapa de la ciudad de Buenos Aires (marca geo), y colorear cada barrio con un color (canal) distinto según el canal de reclamo más utilizado. mantuvimos una misma paleta de colores porque nos pareció más armonioso.

*heatmap:* la marca que utilizamos fue de celdas, lo que nos permitió crear una matriz que relacionaba barrios-canales para luego poder utilizar el canal del color para representar la proporción de reclamos que cada canal representaba en cada barrio.

*gráfico de barras:* en principio pensamos hacer un gráfico de lineas, donde cada linea iría de la fecha de ingreso promedio a la fecha de cierre promedio, pero elegimos usar barras para poder incluir los labels o nombres de canales sobre cada barra y no en un eje. graficamos barras en el eje Y porque el tiempo y su avance se representa mejor de manera horizontal. el color lo usamos para resaltar los canales con menor y mayor tasa de resolución.

## **justificar las decisiones de diseño tomadas para la representación de los datos:**
en general elegimos mantener una única paleta de colores porque nos parecía más armonioso. en el caso del heatmap era particularmente importante tener una paleta en "degradé" que permitiera visualizar el incremento de la proporción. elegimos el scheme YlGnBu porque nos pareció que era de las mejores para visualizar esto, y además iba más o menos acorde a la paleta de amarillos y celestes del Gobierno de la Ciudad (no es la misma porque queriámos más sutileza en las transiciones de colores).

elegimos dejar un fondo blanco en el html para ir en concordancia con las páginas de buenosaires.gob.ar, así que lógicamente también dejamos el fondo de los gráficos blancos para que no creen una ventana de color innecesaria. las líneas que separan los barrios de caba también son blancas por este motivo, para no agregar contraste que no aporta, ya que con las líneas blancas y de ese grosor se visualiza bien sobre el fondo del mismo color. para no incluir una referencia que distrajera del gráfico, la incluimos implícitamente con un "color coding" en el subtítulo.

en el heatmap usamos los ejes porque era la única forma de que quedara claro, y en el caso del eje X rotamos las palabras en 45˚ para que sean legibles. pensamos que esto no iba a quedar bien y otra solución posible era cambiar los nombres de los barrios por abreviaturas, pero creemos que se visualiza bien y las abreviaturas podían ser difíciles de entender. pusimos todo en mayúsculas porque nos pareció que tanto texto en minúscula se perdía. la leyenda era absolutamente necesaria, pero la pusimos en vertical a la derecha del mapa porque si la poníamos arriba (o abajo) debía ser muy larga (lo cuál no servía) o quedaba muy corta y antiestética. solo marcamos el 0, 50 y 100 porciento porque era lo suficientemente claro, y tuvimos que hacerlo con figma porque la librería Plot no permite mucha modificación de las leyendas.

para el gráfico de barras elegimos no incluir ejes porque preferimos evitar quitar la atención del gráfico en sí siempre que sea posible. el eje Y lo solucionamos muy fácil, incluyendo los nombres de los canales sobre las barras mismas y en línea. para las fechas en el eje X decidimos marcar la de inicio y cierre promedio para el canal con menos tiempo en cerrar y el más lento, para contrastar y tener puntos de referencia claros. lo hicimos en formato día numérico y abreviatura de mes porque los números mareaban un poco (en especial en 20 AGO y 23 AGO, eran muy parecidos 20/08 y 23/08), y en mayúscula nos pareció más visual y claro (algo parecido a lo que hicimos con el heatmap). los colores de las barras los para enfatizar los canales más rápidos y lentos (es decir, los mismos donde pusimos las fechas)

## **indicar si realizaron una transformación de los datos y por qué:**
sí, todos nuestros gráficos los realizamos a partir de transformaciones de datos porque necesitabamos agruparlos según ciertas características (principalmente barrios y canales).