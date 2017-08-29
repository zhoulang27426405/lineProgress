# lineProgress
## Usage
1 Dom element is needed, canvas or div or whatever
```
<canvas id="a" width='200' height='200'></canvas>
```
or
```
<div id="b"></div>
```
2 Then load component js
```
<script src="lineProgress.js"></script>
```
3 Then initialization
```
<script>
var circle = new lineProgress({
	element: document.getElementById('a'),
	current: 0.23
})
</script>
```
4 use
```
circle.draw(0.99)
```
