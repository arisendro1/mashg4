import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { HDate } from "@hebcal/core";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const basicInfoSchema = z.object({
  factoryName: z.string().min(1, "Factory name is required"),
  factoryAddress: z.string().min(1, "Factory address is required"),
  mapLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  hebrewDate: z.string().optional(),
  gregorianDate: z.string().min(1, "Gregorian date is required"),
  // Contact information
  contactName: z.string().optional(),
  contactPosition: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  // Background information
  currentProducts: z.string().optional(),
  employeeCount: z.string().optional(),
  shiftsPerDay: z.string().optional(),
  workingDays: z.string().optional(),
  kashrut: z.string().optional(),
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface BasicInfoFormProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFactorySelected?: boolean; // New prop to determine if factory is pre-selected
}

export function BasicInfoForm({ data, onUpdate, onNext, isFactorySelected = false }: BasicInfoFormProps) {
  // Generate Hebrew date for default Gregorian date if not provided
  const getDefaultHebrewDate = () => {
    if (data?.hebrewDate) return data.hebrewDate;
    
    const gregorianDateString = data?.gregorianDate || new Date().toISOString().split('T')[0];
    try {
      const gregorianDate = new Date(gregorianDateString);
      const hebrewDate = new HDate(gregorianDate);
      return hebrewDate.toString();
    } catch (error) {
      console.error('Error converting default date to Hebrew:', error);
      return "";
    }
  };

  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      factoryName: data?.factoryName || "",
      factoryAddress: data?.factoryAddress || "",
      mapLink: data?.mapLink || "",
      gregorianDate: data?.gregorianDate || new Date().toISOString().split('T')[0],
      hebrewDate: getDefaultHebrewDate(),
      contactName: data?.contactName || "",
      contactPosition: data?.contactPosition || "",
      contactEmail: data?.contactEmail || "",
      contactPhone: data?.contactPhone || "",
      currentProducts: data?.currentProducts || "",
      employeeCount: data?.employeeCount || "",
      shiftsPerDay: data?.shiftsPerDay || "",
      workingDays: data?.workingDays || "",
      kashrut: data?.kashrut || "",
    },
  });

  // Update form when data changes (e.g., from factory selection)
  useEffect(() => {
    form.reset({
      factoryName: data?.factoryName || "",
      factoryAddress: data?.factoryAddress || "",
      mapLink: data?.mapLink || "",
      gregorianDate: data?.gregorianDate || new Date().toISOString().split('T')[0],
      hebrewDate: getDefaultHebrewDate(),
      contactName: data?.contactName || "",
      contactPosition: data?.contactPosition || "",
      contactEmail: data?.contactEmail || "",
      contactPhone: data?.contactPhone || "",
      currentProducts: data?.currentProducts || "",
      employeeCount: data?.employeeCount || "",
      shiftsPerDay: data?.shiftsPerDay || "",
      workingDays: data?.workingDays || "",
      kashrut: data?.kashrut || "",
    });
  }, [data, form]);

  // Auto-populate Hebrew date when Gregorian date changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'gregorianDate' && value.gregorianDate) {
        try {
          const gregorianDate = new Date(value.gregorianDate);
          const hebrewDate = new HDate(gregorianDate);
          const hebrewDateString = hebrewDate.toString();
          form.setValue('hebrewDate', hebrewDateString);
        } catch (error) {
          console.error('Error converting to Hebrew date:', error);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (formData: BasicInfoFormData) => {
    onUpdate({ ...data, ...formData });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Factory Information Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-text-primary">
            Factory Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="factoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Factory Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter factory name" 
                        {...field} 
                        readOnly={isFactorySelected}
                        className={isFactorySelected ? "bg-gray-100" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="factoryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Factory Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter factory address" 
                        className={`h-20 ${isFactorySelected ? "bg-gray-100" : ""}`}
                        {...field} 
                        readOnly={isFactorySelected}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mapLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps Link</FormLabel>
                    <FormControl>
                      <Input 
                        type="url" 
                        placeholder="https://goo.gl/maps..." 
                        {...field} 
                        readOnly={isFactorySelected}
                        className={isFactorySelected ? "bg-gray-100" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Contact Information Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-text-primary">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter contact name" 
                          {...field} 
                          readOnly={isFactorySelected}
                          className={isFactorySelected ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position/Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter position" 
                          {...field} 
                          readOnly={isFactorySelected}
                          className={isFactorySelected ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter email" 
                          {...field} 
                          readOnly={isFactorySelected}
                          className={isFactorySelected ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter phone number" 
                          {...field} 
                          readOnly={isFactorySelected}
                          className={isFactorySelected ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Production Background Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-text-primary">
            Production Background
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="currentProducts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Products Currently Manufactured</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the products manufactured"
                        className={`h-20 ${isFactorySelected ? "bg-gray-100" : ""}`}
                        {...field} 
                        readOnly={isFactorySelected}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="employeeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Count</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Number" 
                          {...field} 
                          readOnly={isFactorySelected}
                          className={isFactorySelected ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shiftsPerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shifts per Day</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Number" 
                          {...field} 
                          readOnly={isFactorySelected}
                          className={isFactorySelected ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workingDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Days</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Days/week" 
                          {...field} 
                          readOnly={isFactorySelected}
                          className={isFactorySelected ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kashrut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kashrut Status</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Status" 
                          {...field} 
                          readOnly={isFactorySelected}
                          className={isFactorySelected ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Inspection Details Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-text-primary">
            Inspection Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gregorianDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inspection Date (Gregorian)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hebrewDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inspection Date (Hebrew)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="תאריך עברי" 
                          {...field}
                          readOnly
                          className="bg-gray-100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Continue to Documents
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
