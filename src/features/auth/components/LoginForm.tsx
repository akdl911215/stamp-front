import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Spinner } from "@/shared/ui/Spinner";
import { login } from "../api";
import { useAuthStore } from "../store";
import { useNavigate, useLocation } from "react-router-dom";

const schema = z.object({
    username: z
    .string()
    .min(3, "유저네임은 최소 3자 이상이어야 합니다.")
    .max(20, "유저네임은 최대 20자까지 가능합니다.")
    .regex(/^[a-zA-Z0-9_]+$/, "영문, 숫자, 밑줄(_)만 사용할 수 있습니다."),
    password: z.string().min(6, "비밀번호는 6자 이상입니다."),
});
type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const setAccessToken = useAuthStore(s => s.setAccessToken);
  const setAdminUsername = useAuthStore(s => s.setAdminUsername);
  const nav = useNavigate();
  const loc = useLocation();
  const redirectTo = (loc.state as any)?.from?.pathname || "/customers";

  async function onSubmit(values: FormValues) {
    setServerErr(null);
    try {
      const res = await login(values);
      console.log('loginForm res : ', res);

      setAccessToken(res.accessToken);
      setAdminUsername(res.username);
      nav(redirectTo, { replace: true });
    } catch (e: any) {
      // 서버에서 메시지 내려주면 사용
      setServerErr(e?.response?.data?.message ?? "로그인에 실패했습니다.");
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState && e.getModifierState("CapsLock")) {
      // 필요시 CapsLock 배지 노출
    }
  };

  return (
    <Card>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Label htmlFor="username">유저네임</Label>
        <Input id="username" type="username" placeholder="admin"
               aria-invalid={!!errors.username} {...register("username")} />
        {errors.username && <Err role="alert">{errors.username.message}</Err>}

        <Label htmlFor="password">비밀번호</Label>
        <PwWrap>
          <Input id="password" type={showPw ? "text" : "password"}
                 placeholder="••••••••" aria-invalid={!!errors.password}
                 onKeyUp={handleKey} {...register("password")} />
          <PwToggle type="button" onClick={() => setShowPw(v => !v)}>
            {showPw ? "숨기기" : "표시"}
          </PwToggle>
        </PwWrap>
        {errors.password && <Err role="alert">{errors.password.message}</Err>}

        {serverErr && <ServerErr role="alert">{serverErr}</ServerErr>}

        <Button full disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? <Spinner aria-label="로딩중" /> : "로그인"}
        </Button>
      </Form>
    </Card>
  );
}

const Form = styled.form`display: grid; gap: 12px;`;
const Label = styled.label`font-size: 14px; font-weight: 600;`;
const Err = styled.div`color: ${({ theme }) => theme.colors.danger}; font-size: 13px;`;
const ServerErr = styled.div`
  background: #fff0f0; border: 1px solid #ffd6d6; color: #b00020;
  padding: 8px 10px; border-radius: 8px; font-size: 13px;
`;
const PwWrap = styled.div`position: relative;`;
const PwToggle = styled.button`
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  border: none; background: transparent; color: ${({ theme }) => theme.colors.muted};
`;
