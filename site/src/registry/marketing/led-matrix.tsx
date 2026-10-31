"use client";

import { useMemo, useRef } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { cn } from "cn";
import {
  CustomBlending,
  GLSL3,
  type Mesh,
  OneFactor,
  SrcAlphaFactor,
  ShaderMaterial as ThreeShaderMaterial,
  Vector2,
  Vector3,
} from "three";

interface Props {
  animationSpeed?: number;
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  opacities?: number[];
  showGradient?: boolean;
}

export function LedMatrix({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize = 3,
  showGradient = true,
}: Props) {
  return (
    <div className={cn("relative size-full bg-background", containerClassName)}>
      <div className="size-full">
        <DotMatrix
          colors={colors}
          dotSize={dotSize}
          opacities={opacities}
          shader={`
              float animation_speed_factor = ${animationSpeed.toFixed(1)};
              float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
              opacity *= step(intro_offset, u_time * animation_speed_factor);
              opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            `}
        />
      </div>
      {showGradient ? (
        <div className="absolute inset-0 bg-linear-to-t from-background to-84%" />
      ) : null}
    </div>
  );
}

interface DotMatrixProps {
  colors?: number[][];
  dotSize?: number;
  opacities?: number[];
  shader?: string;
}

function DotMatrix({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  dotSize = 2,
  shader = "",
}: DotMatrixProps) {
  const uniforms = useMemo<Uniforms>(() => {
    const [firstColor, secondColor, thirdColor] = colors as [
      number[],
      number[]?,
      number[]?,
    ];

    let colorsArray = [
      firstColor,
      firstColor,
      firstColor,
      firstColor,
      firstColor,
      firstColor,
    ];

    if (colors.length === 2) {
      colorsArray = [
        firstColor,
        firstColor,
        firstColor,
        secondColor as number[],
        secondColor as number[],
        secondColor as number[],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        firstColor,
        firstColor,
        secondColor as number[],
        secondColor as number[],
        thirdColor as number[],
        thirdColor as number[],
      ];
    }

    return {
      u_colors: {
        type: "uniform3fv",
        value: colorsArray.map(([red, green, blue]) => [
          red / 255,
          green / 255,
          blue / 255,
        ]),
      },
      u_dot_size: {
        type: "uniform1f",
        value: dotSize,
      },
      u_opacities: {
        type: "uniform1fv",
        value: opacities,
      },
      u_total_size: {
        type: "uniform1f",
        value: 4,
      },
    };
  }, [colors, opacities, dotSize]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        out vec4 fragColor;
        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }
        void main() {
            vec2 st = fragCoord.xy;
            st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));
            st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));
            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            ${shader}

            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
    />
  );
}

type UniformType =
  | "uniform1f"
  | "uniform3f"
  | "uniform1fv"
  | "uniform3fv"
  | "uniform2f";

type UniformValue = number[] | number[][] | number;

type Uniforms = Record<
  string,
  {
    value: UniformValue;
    type: UniformType;
  }
>;

interface PreparedUniform {
  type: string;
  value: unknown;
}

const prepareUniform: Record<
  UniformType,
  (value: UniformValue) => PreparedUniform
> = {
  uniform1f: (value) => ({
    type: "1f",
    value,
  }),
  uniform1fv: (value) => ({
    type: "1fv",
    value,
  }),
  uniform2f: (value) => ({
    type: "2f",
    value: new Vector2().fromArray(value as number[]),
  }),
  uniform3f: (value) => ({
    type: "3f",
    value: new Vector3().fromArray(value as number[]),
  }),
  uniform3fv: (value) => ({
    type: "3fv",
    value:
      Array.isArray(value) && Array.isArray(value[0])
        ? (value as number[][]).map((v) => new Vector3().fromArray(v))
        : value,
  }),
};

function ShaderMaterial({
  source,
  uniforms,
}: {
  source: string;
  uniforms: Uniforms;
}) {
  const { size } = useThree();
  const ref = useRef<Mesh | null>(null);
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    const timestamp = clock.getElapsedTime();
    if (timestamp - lastFrameTime < 1 / 60) {
      return;
    }

    lastFrameTime = timestamp;

    const material = ref.current.material as ThreeShaderMaterial;
    const { u_time: timeLocation } = material.uniforms;
    if (timeLocation) {
      timeLocation.value = timestamp;
    }
  });

  const getUniforms = () => {
    const preparedUniforms: Record<string, PreparedUniform> = {};

    for (const [uniformName, uniform] of Object.entries(uniforms)) {
      preparedUniforms[uniformName] = prepareUniform[uniform.type](
        uniform.value
      );
    }

    const timeUniform: PreparedUniform = { type: "1f", value: 0 };
    const resolutionUniform: PreparedUniform = {
      type: "2f",
      value: new Vector2(size.width * 2, size.height * 2),
    };

    return {
      ...preparedUniforms,
      u_resolution: resolutionUniform,
      u_time: timeUniform,
    };
  };

  // Shader material
  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  const material = useMemo(() => {
    const materialObject = new ThreeShaderMaterial({
      blendDst: OneFactor,
      blending: CustomBlending,
      blendSrc: SrcAlphaFactor,
      fragmentShader: source,
      glslVersion: GLSL3,
      uniforms: getUniforms(),
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
    });

    return materialObject;
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref}>
      {/* biome-ignore lint/suspicious/noUnknownAttribute: React Three Fiber passes args to the Three.js geometry constructor. */}
      <planeGeometry args={[2, 2]} />
      {/* biome-ignore lint/suspicious/noUnknownAttribute: React Three Fiber uses attach/object to bind the material instance. */}
      <primitive attach="material" object={material} />
    </mesh>
  );
}

function Shader({ source, uniforms }: { source: string; uniforms: Uniforms }) {
  return (
    <Canvas className="absolute inset-0 size-full">
      <ShaderMaterial source={source} uniforms={uniforms} />
    </Canvas>
  );
}
