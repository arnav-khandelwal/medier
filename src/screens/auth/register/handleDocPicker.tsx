
import { pick } from '@react-native-documents/picker';
import { Alert, Platform } from 'react-native';

export const handlePickCV = async (setCvFile: (file: any) => void) => {
    try {
      const result = await pick({
        type: Platform.OS === 'ios' 
          ? ['com.adobe.pdf', 'public.image', 'public.jpeg', 'public.png']
          : ['application/pdf', 'image/*'],
        allowMultiSelection: false,
      });
      if (result.length > 0) {
        setCvFile({
          uri: result[0].uri || '',
          name: result[0].name || 'CV File',
          type: result[0].type || 'application/pdf',
        });
      }
    } catch (err: any) {
        if (err?.code === 'OPERATION_CANCELED') {
            return;
        }
        console.error(err);
        Alert.alert('Error', 'Failed to pick CV file');
    }
  };

  export const handlePickLicense = async (setLicenseFile: (file: any) => void) => {
    try {
      const result = await pick({
        type: Platform.OS === 'ios'
          ? ['com.adobe.pdf', 'public.image', 'public.jpeg', 'public.png']
          : ['application/pdf', 'image/*'],
        allowMultiSelection: false,
      });
      if (result.length > 0) {
        setLicenseFile({
          uri: result[0].uri || '',
          name: result[0].name || 'License File',
          type: result[0].type || 'application/pdf',
        });
      }
    } catch (err: any) {
      if (err?.code === 'OPERATION_CANCELED') {
        return;
      }
      console.error(err);
      Alert.alert('Error', 'Failed to pick license file');
    }
  };