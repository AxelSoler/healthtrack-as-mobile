import { Button } from 'react-native';
import { supabase } from '@/utils/supabase';

export function SignOutButton() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return <Button title="Cerrar Sesión" onPress={handleSignOut} color="red" />;
}