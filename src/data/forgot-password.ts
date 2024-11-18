import axios from '@/config/axiosConfig';

export async function forgotPassword({ email }: { email: string }) {
    try {
        return await axios.post('/user/loss-pass', { email });
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        }
        throw new Error('Something went wrong');
    }
}