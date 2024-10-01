export default (uniforms) => ({
  uniforms,
  vertexShader: `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  fragmentShader: `
  varying vec2 vUv;
  uniform vec3 baseColor;
  uniform vec3 stripeColor;

  void main() {
    // всего 7 частей по горизонтали
    float stripes = 7.0 * vUv.x;
    float rounded = floor(stripes);

    if (mod(rounded, 2.0) == 1.0) {
      gl_FragColor = vec4(stripeColor, 1.0);
    }
    else{
      gl_FragColor = vec4(baseColor, 1.0);
    }
  }
  `
});
