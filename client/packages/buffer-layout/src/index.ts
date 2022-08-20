import BN from "bn.js";
import {
  Layout,
  Blob,
  blob,
  u32,
  struct,
  offset,
  seq,
  Structure,
  u8,
} from "@solana/buffer-layout";

export {
  blob,
  f32,
  f64,
  Layout,
  s16 as i16,
  s32 as i32,
  s8 as i8,
  seq,
  struct,
  u16,
  u32,
  u8,
  union,
} from "@solana/buffer-layout";
export { bool, decimal, publicKey } from "@solana/buffer-layout-utils";

export function u64(property?: string): Layout<BN> {
  return new BNLayout(8, false, property);
}

export function i64(property?: string): Layout<BN> {
  return new BNLayout(8, true, property);
}

export function u128(property?: string): Layout<BN> {
  return new BNLayout(16, false, property);
}

export function i128(property?: string): Layout<BN> {
  return new BNLayout(16, true, property);
}

class BNLayout extends Layout<BN> {
  blob: Blob;
  signed: boolean;

  constructor(span: number, signed: boolean, property?: string) {
    super(span, property);
    this.blob = blob(span);
    this.signed = signed;
  }

  encode(src: BN, b: Buffer, offset = 0) {
    if (this.signed) {
      src = src.toTwos(this.span * 8);
    }

    return this.blob.encode(
      src.toArrayLike(Buffer, "le", this.span),
      b,
      offset
    );
  }

  decode(b: Buffer, offset = 0) {
    const num = new BN(this.blob.decode(b, offset), 10, "le");
    if (this.signed) {
      return num.fromTwos(this.span * 8).clone();
    }
    return num;
  }
}

export function option<T>(
  layout: Layout<T>,
  property?: string
): Layout<T | null> {
  return new OptionLayout<T>(layout, property);
}

class OptionLayout<T> extends Layout<T | null> {
  layout: Layout<T>;
  discriminator: Layout<number>;

  constructor(layout: Layout<T>, property?: string) {
    super(-1, property);
    this.layout = layout;
    this.discriminator = u8();
  }

  encode(src: T | null, b: Buffer, offset = 0): number {
    if (src === null || src === undefined) {
      return this.discriminator.encode(0, b, offset);
    }

    this.discriminator.encode(1, b, offset);
    return (
      this.discriminator.span +
      this.layout.encode(src, b, offset + this.discriminator.span)
    );
  }

  decode(b: Buffer, offset = 0): T | null {
    const discriminator = this.discriminator.decode(b, offset);
    if (discriminator === 0) {
      return null;
    } else if (discriminator === 1) {
      return this.layout.decode(b, offset + this.discriminator.span);
    }

    throw new Error("Invalid option " + this.layout.property);
  }

  getSpan(b: Buffer, offset = 0): number {
    const discriminator = this.discriminator.decode(b, offset);
    if (discriminator === 0) {
      return 1;
    } else if (discriminator === 1) {
      return this.layout.getSpan(b, offset + 1) + 1;
    }
    throw new Error("Invalid option " + this.property);
  }
}

export function coption<T>(
  layout: Layout<T>,
  property?: string
): Layout<T | null> {
  return new COptionLayout<T>(layout, property);
}

class COptionLayout<T> extends Layout<T | null> {
  layout: Layout<T>;
  discriminator: Layout<number>;

  constructor(layout: Layout<T>, property?: string) {
    super(-1, property);
    this.layout = layout;
    this.discriminator = u32();
  }

  encode(src: T | null, b: Buffer, offset = 0): number {
    if (src === null || src === undefined) {
      return this.layout.span + this.discriminator.encode(0, b, offset);
    }
    this.discriminator.encode(1, b, offset);

    return (
      this.discriminator.span +
      this.layout.encode(src, b, offset + this.discriminator.span)
    );
  }

  decode(b: Buffer, offset = 0): T | null {
    const discriminator = this.discriminator.decode(b, offset);
    if (discriminator === 0) {
      return null;
    } else if (discriminator === 1) {
      return this.layout.decode(b, offset + this.discriminator.span);
    }

    throw new Error("Invalid coption " + this.layout.property);
  }

  getSpan(b: Buffer, offset = 0): number {
    return (
      this.discriminator.span +
      this.layout.getSpan(b, offset + this.discriminator.span)
    );
  }
}

export function vec<T, U>(layout: Layout<T>, property?: string): Layout<U> {
  return new VecLayout<T, U>(layout, property);
}

class VecLayout<T, U> extends Layout<U> {
  layout: Structure<any>;

  constructor(layout: Layout<T>, property?: string) {
    super(-1, property);
    this.layout = struct<
      Readonly<{
        length?: number;
        src: T;
      }>
    >(
      [
        u32("length"),
        // @ts-ignore
        seq(layout, offset(u32(), -4), "src"),
      ],
      property
    );
  }

  encode(src: any | null, b: Buffer, offset = 0): number {
    const data = {
      src,
    };
    return this.layout.encode(data, b, offset);
  }

  decode(b: Buffer, offset = 0): U {
    const data = this.layout.decode(b, offset);
    return data.src;
  }

  getSpan(b: Buffer, offset = 0): number {
    return this.layout.getSpan(b, offset);
  }
}

export function bytes(property?: string): Layout<Uint8Array> {
  return new BytesLayout(property);
}

class BytesLayout extends Layout<Uint8Array | null> {
  layout = struct<
    Readonly<{
      length?: number;
      src: Uint8Array;
    }>
  >(
    [
      u32("length"),
      // @ts-ignore
      blob(offset(u32(), -4), "src"),
    ],
    this.property
  );

  constructor(property?: string) {
    super(-1, property);
  }

  encode(src: Uint8Array | Buffer | null, b: Buffer, offset = 0): number {
    if (src === null || src === undefined) {
      return this.layout.span;
    }
    const data = {
      src,
    };

    return this.layout.encode(data, b, offset);
  }

  decode(b: Buffer, offset = 0): Uint8Array {
    const data = this.layout.decode(b, offset);
    return data.src;
  }

  getSpan(b: Buffer, offset = 0): number {
    return (
      u32().span +
      new BN(new Uint8Array(b).slice(offset, offset + 4), 10, "le").toNumber()
    );
  }
}

export function utf8Str(property?: string) {
  return new Utf8StringLayout(property);
}

class Utf8StringLayout extends Layout<string | null> {
  layout = struct<
    Readonly<{
      length?: number;
      src: Buffer;
    }>
  >(
    [
      u32("length"),
      // @ts-ignore
      blob(offset(u32(), -4), "src"),
    ],
    this.property
  );

  constructor(property?: string) {
    super(-1, property);
  }

  encode(src: string | null, b: Buffer, offset = 0): number {
    if (src === null || src === undefined) {
      return this.layout.span;
    }

    const data = {
      src: Buffer.from(src, "utf8"),
    };

    return this.layout.encode(data, b, offset);
  }

  decode(b: Buffer, offset = 0): string | null {
    const data = this.layout.decode(b, offset);
    return data.src.toString();
  }

  getSpan(b: Buffer, offset = 0): number {
    return (
      u32().span +
      new BN(new Uint8Array(b).slice(offset, offset + 4), 10, "le").toNumber()
    );
  }
}
