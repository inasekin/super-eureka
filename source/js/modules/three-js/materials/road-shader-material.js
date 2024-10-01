export default (uniforms) => ({
  uniforms,
  vertexShader: `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position   = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  fragmentShader: `
  varying vec2 vUv;
  uniform vec3 baseColor;
  uniform vec3 stripeColor;

  void main() {
    // по вертикали 3 части (дорога, полоса, дорога)
    float stripesY = 3.0 * vUv.y;
    float roundedY = floor(stripesY);
    // по горизонтали 9 частей (дорога, полоса, дорога ... полоса, дорога).
    float stripesX = 9.0 * vUv.x;
    float roundedX = floor(stripesX);

    if (
      mod(roundedY, 2.0) == 1.0 &&
      vUv.y < 0.60 && vUv.y > 0.40 &&
      mod(roundedX, 2.0) == 1.0
    ) {
      gl_FragColor = vec4(stripeColor, 1.0);
    } else {
      gl_FragColor = vec4(baseColor, 1.0);
    }
  }
  `
});
