// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  HelperText,
  Switch,
  Card,
  Divider,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useTheme as useAppTheme } from "../contexts/ThemeContext";
import { StorageService } from "../services/storage";
import { User } from "../types";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user, signOut, updateUser } = useAuth();
  const { theme: appTheme, toggleTheme, isDark } = useAppTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("phoneNumber", user.phoneNumber);
    }
  }, [user]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsLoading(true);
    setSuccessMessage("");
    try {
      const updatedUser: User = {
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      };

      await updateUser(updatedUser); 
      setSuccessMessage("Profil uspešno ažuriran! ✅");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text variant="displaySmall" style={styles.title}>
            Moj Profil 👤
          </Text>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                📧 Email
              </Text>
              <Text variant="bodyLarge" style={styles.email}>
                {user?.email}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                ✏️ Lični podaci
              </Text>

              <Controller
                control={control}
                name="firstName"
                rules={{
                  required: "Ime je obavezno",
                  minLength: {
                    value: 2,
                    message: "Ime mora imati najmanje 2 karaktera",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label="Ime"
                      mode="outlined"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.firstName}
                      style={styles.input}
                    />
                    <HelperText type="error" visible={!!errors.firstName}>
                      {errors.firstName?.message}
                    </HelperText>
                  </>
                )}
              />

              <Controller
                control={control}
                name="lastName"
                rules={{
                  required: "Prezime je obavezno",
                  minLength: {
                    value: 2,
                    message: "Prezime mora imati najmanje 2 karaktera",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label="Prezime"
                      mode="outlined"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.lastName}
                      style={styles.input}
                    />
                    <HelperText type="error" visible={!!errors.lastName}>
                      {errors.lastName?.message}
                    </HelperText>
                  </>
                )}
              />

              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  required: "Broj telefona je obavezan",
                  pattern: {
                    value: /^[0-9+\-\s()]{9,}$/,
                    message: "Neispravan format broja telefona",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label="Broj telefona"
                      mode="outlined"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      error={!!errors.phoneNumber}
                      style={styles.input}
                      placeholder="+381 60 123 4567"
                    />
                    <HelperText type="error" visible={!!errors.phoneNumber}>
                      {errors.phoneNumber?.message}
                    </HelperText>
                  </>
                )}
              />

              {successMessage ? (
                <Text variant="bodyMedium" style={styles.successText}>
                  {successMessage}
                </Text>
              ) : null}

              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Sačuvaj izmene
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                🎨 Podešavanja
              </Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text variant="bodyLarge" style={styles.settingLabel}>
                    {isDark ? "🌙 Tamna tema" : "☀️ Svetla tema"}
                  </Text>
                  <Text variant="bodySmall" style={styles.settingDescription}>
                    Promeni izgled aplikacije
                  </Text>
                </View>
                <Switch value={isDark} onValueChange={toggleTheme} />
              </View>
            </Card.Content>
          </Card>

          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            contentStyle={styles.buttonContent}
            textColor={theme.colors.error}
          >
            Odjavi se
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  email: {
    opacity: 0.7,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  logoutButton: {
    marginTop: 10,
    marginBottom: 20,
    borderColor: "#FF6B6B",
  },
  successText: {
    color: "#4CAF50",
    marginTop: 8,
    fontWeight: "bold",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    opacity: 0.6,
  },
});
