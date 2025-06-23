import Image from 'next/image';

type Props = {
  name: string;
  image: string;
  description: string;
};

const CircleCard = ({ name, image, description }: Props) => (
  <div className="flex flex-col items-center w-40 text-center">
    <div className="w-32 h-32 rounded-full overflow-hidden shadow-md border">
      <Image src={image} alt={name} width={128} height={128} className="object-cover w-full h-full" loading="lazy" />
    </div>
    <h4 className="mt-2 font-semibold text-sm">{name}</h4>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);
export default CircleCard;