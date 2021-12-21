import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Text,
} from "@chakra-ui/react";

const SettingsGeneral = () => {
  return (
    <div>
      <Text mb={5}>
        These settings affect how the station is shown on the frontend
      </Text>
      <FormControl>
        <FormLabel htmlFor="stationName">Station Name</FormLabel>
        <Input type="text" placeholder="Bottle Radio" />
      </FormControl>
    </div>
  );
};

export default SettingsGeneral;
