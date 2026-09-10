import Image from "next/image";

type KairosMarkProps = {
  className?: string;
  priority?: boolean;
};

export function KairosMark({ className, priority = false }: KairosMarkProps) {
  return (
    <Image
      src="/brand/kairos-mark.png"
      alt=""
      width={1254}
      height={1254}
      className={className}
      priority={priority}
      aria-hidden="true"
    />
  );
}
