"use client";

import { Building, MapPin, User } from "lucide-react-native";
import { Text, View } from "react-native";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

export default function BankDetailsPage({ bankData }: { bankData: any }) {
  const bankDetails = bankData;

  const sections = [
    {
      id: "account",
      title: "Account Information",
      icon: <User size={16} color={"#a3a3a3"} />,
      fields: [
        { label: "Account Holder", value: bankDetails.accountHolder },
        {
          label: "Account Type",
          value: bankDetails.accountType,
          capitalize: true,
        },
        { label: "Account Number", value: bankDetails.accountNumber },
        { label: "PAN", value: bankDetails.permanentaccountNumber },
      ],
      colSpan: 1,
    },
    {
      id: "bank",
      title: "Bank Information",
      icon: <Building size={16} color={"#a3a3a3"} />,
      fields: [
        { label: "Bank Name", value: bankDetails.bankName },
        { label: "IFSC Code", value: bankDetails.ifscCode },
      ],
      colSpan: 1,
    },
    {
      id: "address",
      title: "Address Information",
      icon: <MapPin size={16} color={"#a3a3a3"} />,
      fields: [
        { label: "Street", value: bankDetails.userStreetAddress },
        { label: "Flat/House", value: bankDetails.userFlat },
        { label: "City", value: bankDetails.userCity, capitalize: true },
        { label: "State", value: bankDetails.userState, capitalize: true },
        { label: "Country", value: bankDetails.userCountry },
        { label: "Postcode", value: bankDetails.userPostcode },
      ],
      colSpan: 2, // Make address span full width
    },
  ];

  return (
    <View className='mt-1.5'>
      <Text className='pl-1 text-lg text-foreground font-semibold leading-none'>
        Bank Account Details
      </Text>
      <View className='mt-3 w-fit rounded bg-yellow-100  text-xs '>
        <Text className='text-sm font-medium text-gray-700 px-3 py-1.5'>
          If you need to update your bank details, please contact our support
          team.
        </Text>
      </View>

      {/* Summary Card */}
      <Card className='mb-4 mt-4 md:mb-6 border-border'>
        <CardContent className='p-6'>
          <View className='flex-row justify-between gap-4 items-center'>
            <View>
              <Text className='text-base font-semibold text-foreground'>
                {bankDetails.accountHolder}
              </Text>
              <Text className='mt-1.5 text-sm text-muted-foreground'>
                {bankDetails.bankName} • {bankDetails.accountNumber}
              </Text>
            </View>
            <View className='flex items-center'>
              <Badge className='bg-green-100 capitalize  '>
                <Text className='text-green-800 text-sm'>Active</Text>
              </Badge>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Main content grid */}
      <View className='gap-4 '>
        {sections.map((section) => (
          <Card key={section.id} className={cn("border-border")}>
            <CardHeader className='gap-2.5 pb-3'>
              <View className='flex-row items-center gap-2'>
                <View>{section.icon}</View>
                <Text className='text-base font-medium text-foreground/80'>
                  {section.title}
                </Text>
              </View>
              <Separator />
            </CardHeader>
            <CardContent>
              <View className='gap-4'>
                {section.fields.map((field, index) => (
                  <View key={index} className='flex-row gap-4'>
                    <Text className='text-sm font-medium text-muted-foreground'>
                      {field.label}
                    </Text>
                    <Text className={"text-sm capitalize text-foreground"}>
                      {field.value}
                    </Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  );
}
