import {
  Building2,
  BusFront,
  CarFront,
  Home,
  MapIcon,
  PlaneTakeoff,
  TrainFront,
  TrainIcon,
  Users,
} from "lucide-react-native";
import { Text, View } from "react-native";
import { cn } from "~/lib/utils";
import { IProperty } from "~/types";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const PropertyDetail = ({ product }: { product: IProperty }) => {
  return (
    <View className='pl-1.5 mt-5'>
      <View className='flex-row items-center gap-2 justify-between pr-1.5'>
        <Text className='text-lg font-semibold text-foreground/80 '>
          {product.title}
        </Text>
        {/* {product?.latitude && product?.longitude ? (
          <Pressable
            onPress={() => router.push(`/home/explore/${product.id}/#location`)}
          >
            <Text className='text-xs font-medium leading-none text-primary'>
              View Map
            </Text>
          </Pressable>
        ) : null} */}
      </View>
      <Text className='mt-2 pl-[1px] text-xs text-muted-foreground md:mt-1 md:text-sm'>
        {product?.address}
      </Text>

      <View className='mb-4 mt-3 flex flex-wrap items-center justify-between border-b border-border pb-4'>
        <View className='mt-1 flex-row items-center  text-muted-foreground'>
          <Users size={14} color={"#6b7280"} />
          <Text className='font-medium ml-1 text-foreground/70 text-sm'>
            &nbsp;
            {product.personCapacity} guests
          </Text>
          <Text className='mx-3'>·</Text>
          <Home size={14} color={"#6b7280"} />
          <Text className='font-medium ml-1 text-foreground/70 text-sm'>
            12 bedrooms
          </Text>
          <Text className='mx-3 text-2xl'>·</Text>
          <Text className='font-medium text-foreground/70 text-sm'>
            10 bathrooms
          </Text>
        </View>
      </View>

      {product?.cityCenterDistance ? (
        <View className='mt-4 flex items-center gap-3 md:mt-6'>
          <MapIcon />
          <View className='flex flex-col gap-0.5'>
            <Text className='text-sm font-semibold capitalize text-foreground/80 md:text-base'>
              {product?.cityCenterDistance} from City Center
            </Text>
            <View className='flex gap-2 text-xs text-muted-foreground md:text-sm'>
              {product?.cityCenterDurationByDriving && (
                <View className='inline-flex items-center gap-1'>
                  <CarFront className='size-4' />
                  <Text className='text-xs leading-none'>
                    {product?.cityCenterDurationByDriving}
                  </Text>
                </View>
              )}

              {product?.cityCenterDurationByTransit && (
                <View className='flex items-center gap-1'>
                  <Separator className='size-1 rounded-full bg-muted-foreground/80' />
                  <View className='inline-flex items-center gap-1'>
                    <TrainFront className='size-4' />
                    <Text className='text-xs leading-none'>
                      {product?.cityCenterDurationByTransit}
                    </Text>
                  </View>
                </View>
              )}
              {product?.cityCenterDurationByWalking && (
                <View className='flex items-center gap-1'>
                  <Separator className='size-1 rounded-full bg-muted-foreground/80' />
                  <View className='inline-flex items-center gap-1'>
                    <WalkingIcon />
                    <Text className='text-xs leading-none'>
                      {product?.cityCenterDurationByWalking}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      ) : null}

      <View
        className={cn(
          "my-4 flex flex-wrap gap-x-2.5 gap-y-2",
          !product?.nearByPlaces?.length && "hidden"
        )}
      >
        {product?.nearByPlaces?.map((item, index) => (
          <Badge
            key={index}
            className='flex flex-row gap-2.5  px-4 bg-background border-border py-1.5'
          >
            <Text className='text-foreground text-xs'>
              {getNearbyPlacesIcon(item.category)}
            </Text>
            <Text className='text-foreground text-xs'>
              {item.value.length > 25
                ? `${item.value.slice(0, 25)}...`
                : item.value}
            </Text>
            <Text> </Text>
            <Text className='text-foreground text-xs'>|</Text>
            <Text className='text-foreground text-xs'>{item.distance}</Text>
            <Text className='text-foreground text-xs'>|</Text>
            <Text className='text-foreground text-xs'>{item.duration}</Text>
          </Badge>
        ))}
      </View>

      <Separator
        className={cn(product.nearByPlaces?.length ? "my-7" : "hidden")}
      />
    </View>
  );
};

export default PropertyDetail;

const getNearbyPlacesIcon = (category: string) => {
  switch (category) {
    case "Airports":
      return <PlaneTakeoff size={18} color={"#a3a3a3"} />;
    case "Bus Stops":
      return <BusFront size={18} color={"#a3a3a3"} />;
    case "Train Stations":
      return <TrainIcon size={18} color={"#a3a3a3"} />;
    default:
      return <Building2 size={18} color={"#a3a3a3"} />;
  }
};

const WalkingIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='18'
      height='18'
      viewBox='0 0 6 13'
      fill='none'
    >
      <path
        d='M5.13541 9.13257C5.11807 9.01283 5.0712 8.89855 4.99913 8.80144L4.0486 7.1591V6.52557L4.78212 7.02765C4.8887 7.10052 5.01326 7.13904 5.14215 7.13904C5.35306 7.13904 5.55032 7.03519 5.6691 6.8612C5.86765 6.57084 5.79301 6.17293 5.50281 5.97422L4.04844 4.97906V3.58344V3.49227C4.04844 3.33449 3.99049 3.19003 3.89531 3.07863C3.82019 2.96628 3.72051 2.87206 3.60447 2.8024C3.87332 2.58619 4.0486 2.24093 4.0486 1.85122C4.0486 1.19762 3.55776 0.666016 2.95456 0.666016C2.35121 0.666016 1.86053 1.19778 1.86053 1.85122C1.86053 2.17866 1.9838 2.4756 2.18267 2.6902C2.0135 2.7292 1.85764 2.82984 1.7448 2.98072L0.468433 4.43959C0.36683 4.55612 0.310652 4.70524 0.310812 4.8513L0.219482 6.86553C0.219482 7.18864 0.455432 7.52266 0.849964 7.52266C1.21817 7.52266 1.49585 7.24016 1.49569 6.87468L1.58365 5.10346L1.86053 4.7871V6.77886C1.86053 6.97596 1.90612 7.16585 1.99038 7.33807L1.87193 8.87736L0.825406 11.3193C0.748522 11.4983 0.746114 11.6965 0.818664 11.8774C0.890894 12.0583 1.02941 12.2002 1.20854 12.2769C1.30019 12.3163 1.39682 12.336 1.49569 12.336C1.78766 12.336 2.05106 12.1625 2.1663 11.8938L3.26049 9.34075C3.29179 9.26707 3.31089 9.18939 3.31715 9.10961L3.32261 9.03803L3.72421 9.53785L4.23832 11.7097C4.28936 12.0667 4.59946 12.336 4.95965 12.336C5.0009 12.336 5.04263 12.3325 5.08468 12.3251C5.46942 12.2591 5.73619 11.879 5.67889 11.4779L5.13541 9.13257ZM5.02289 11.9654C4.81904 12.0007 4.62803 11.8591 4.59625 11.6417L4.05999 9.37333L3.36338 8.50642L3.19645 8.29872L3.02968 8.09102L2.50321 7.43582L2.49037 7.42154C2.44077 7.37162 2.39856 7.31656 2.36228 7.25814C2.27352 7.11529 2.22521 6.9506 2.22521 6.77854V6.66168V6.19749V3.81633L1.22572 4.95836L1.13118 6.86521C1.13118 7.03744 1.01561 7.15766 0.849964 7.15766C0.677256 7.15766 0.58416 7.00694 0.584 6.8734L0.675329 4.85916C0.675329 4.79303 0.699406 4.72899 0.743064 4.67939L2.01895 3.221C2.02618 3.21314 2.0342 3.20303 2.04415 3.18987C2.11702 3.09212 2.22473 3.0361 2.33933 3.0361H2.95472H2.96484H3.13706C3.18762 3.0361 3.23642 3.04348 3.28297 3.05648C3.41763 3.09388 3.53143 3.18136 3.60286 3.29789C3.65406 3.38103 3.68408 3.47846 3.68408 3.58311V5.17103V5.83394V6.05496V6.27598V7.25702L4.68919 8.99357L4.70251 9.01331C4.74071 9.06307 4.76559 9.12214 4.77731 9.19934L5.31903 11.5362C5.34439 11.7412 5.21309 11.9328 5.02289 11.9654ZM2.95344 9.08137C2.95039 9.12133 2.94076 9.16034 2.92503 9.19709L1.831 11.7498C1.75395 11.9294 1.53486 12.0198 1.35204 11.9413C1.26247 11.903 1.19329 11.832 1.15702 11.7416C1.1209 11.6513 1.12219 11.5521 1.16039 11.4625L2.23067 8.96532L2.32103 7.79167L2.98875 8.62247L2.95344 9.08137ZM2.95456 1.03037C3.3568 1.03037 3.68392 1.39842 3.68392 1.8509C3.68392 2.30337 3.3568 2.67142 2.95456 2.67142C2.55233 2.67142 2.22521 2.30337 2.22521 1.8509C2.22521 1.39842 2.55233 1.03037 2.95456 1.03037ZM5.36846 6.65511C5.28628 6.77485 5.10908 6.80871 4.98822 6.72637L4.04876 6.08337V5.42047L5.2972 6.2747C5.42159 6.36009 5.45353 6.53071 5.36846 6.65511Z'
        fill='black'
      />
    </svg>
  );
};
