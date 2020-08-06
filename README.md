# Keyspace
Tool for red teamers to decode keys and master keys from side channel information.  Released at DEF CON 28.

Listen to the talk here:
https://www.youtube.com/watch?v=suN0IsifTyY

See a live version of the tool here:
https://ggrsecurity.com/personal/~bgraydon/keyspace/

Try out some examples to get you started.  Click "Import a System & Rules" at the bottom and import one of the following JSON examples:

S&G Environmental Keyspace:
```
{"numPins":3,"numDepths":3,"lockType":"pin","labelOffset":"1","rules":[{"name":"retain"}]}
```

Schlage construction keyed system with known change keys:
```
{"numPins":5,"numDepths":10,"lockType":"pin","labelOffset":"0","rules":[{"name":"CK","code":"33983","file":false,"twostep":true,"rotateConst":false,"space":false,"minSpace":null,"angle":true,"depth":true},{"name":"CK","code":"59545","file":false,"twostep":true,"rotateConst":false,"space":false,"minSpace":null,"angle":true,"depth":true},{"name":"CMK","depth":4,"pins":"1","MACS":7},{"name":"MACS","MACS":7}]}
```

Sargent lock with coloured pins visible: 
```
{"numPins":6,"numDepths":10,"lockType":"pin","labelOffset":"1","rules":[{"name":"colourPin","colourPinKeySys":1,"colourPinSet":0,"pinColours":["PLAIN","GREEN","PLAIN","GREEN","PLAIN","PURPLE"]},{"name":"shear","shears":["1","","1","","",""],"nonMK":false,"cache":{"p_shears":[[0],[],[0],[2],[3],[]]}},{"name":"MACS","MACS":7}]}
```

Medeco 12-cut IC System with pin 1 high cut:
```
{"numPins":6,"numDepths":6,"lockType":"medeco2","labelOffset":"1","rules":[{"name":"IC","depth":3,"pins":"3,4","MACS":2},{"name":"MACS","MACS":2},{"name":"onehigh","within":1},{"name":"shear","shears":["1","","","","",""],"nonMK":false,"cache":{"p_shears":[[0],[],[],[],[],[]]}}]}
```

Medeco Sidebar Rights Amplification:
```
{"numPins":6,"numDepths":6,"lockType":"medeco2","labelOffset":"1","rules":[{"name":"CK","code":"D K K M S QD","file":false,"twostep":false,"rotateConst":false,"space":false,"minSpace":null,"angle":true,"depth":true},{"name":"shear","shears":["1","3","4","5","3","4"],"nonMK":false,"cache":{"p_shears":[[0],[2],[3],[4],[2],[3]]}},{"name":"CK","code":"2K 6S 5K 3B 5S 3Q","file":false,"twostep":false,"rotateConst":false,"space":false,"minSpace":null,"angle":true,"depth":true},{"name":"CK","code":"4D 4K 3D 2M 1K 3D","file":false,"twostep":false,"rotateConst":false,"space":false,"minSpace":null,"angle":true,"depth":true}]}
```
