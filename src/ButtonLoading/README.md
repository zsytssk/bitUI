<h1 align="center">ButtonLoading 加载按钮</h1>

- 支持加载，成功，禁用 & 鼠标 hover 样式
- 支持根据不同场景，显示对应鼠标光标
- 支持使用 useRef

## 如何使用

```ts
import { useTranslation } from 'react-i18next';
import i18n from '@/config/i18n';
import { ButtonLoading, ButtonLoadingState } from '@ui/ButtonLoading';

const OK_CODE = '0000';

export const Form = (): JSX.Element => {
  const { t } = useTranslation(['login', 'error'], { i18n });
  const ref = useRef<HTMLInputElement>(null);
  const [buttonState, setButtonState] = useState<number>(ButtonLoadingState.DEFAULT);

  const onSubmit = useThrottle(
    async (data: IFormInput): Promise<void> => {
      ...

      setButtonState(ButtonLoadingState.LOADING);

      try {
        ...

        if (res.rspCode === OK_CODE) {
          setButtonState(ButtonLoadingState.SUCCESS);
        } else {
          setButtonState(ButtonLoadingState.DEFAULT);
        }
      } catch (err) {
        setButtonState(ButtonLoadingState.DEFAULT);
      }
    },
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        ...

        <div className="form-btn form-btn_confirm">
          <ButtonLoading ref={ref} type="submit" state={buttonState}>
            {t('confirm')}
          </ButtonLoading>
        </div>
      </form>
    </FormProvider>
  );
};
```

#### 如何使用 useRef

```ts
const ref = useRef<HTMLInputElement>(null);

...

const onHandler = (evt: any) => {
  if (ref.current !== null) {
    ref.current.click();
  }
};

...

<ButtonLoading ref={ref} type="submit" state={buttonState}>
  {t('confirm')}
</ButtonLoading>
```

#### 如何新增按钮样式

在 index.less 中按照 btnMode1 的规则添加样式，只需新增背景色和字体颜色

```less
@btnMode2DefaultLinearGradient: to bottom, #05c9a3, #02996a;
@btnMode2HoverLinearGradient: to bottom, #03ffce, #00c688;
@btnMode2FontColor: #fff;

.btg-button {
  &.btg-button_mode2 {
    background-image: linear-gradient(@btnMode2DefaultLinearGradient);
    color: @btnMode2FontColor;

    &.btg-button_default:hover {
      background-image: linear-gradient(@btnMode2HoverLinearGradient);
    }
  }
}
```

## 属性 & 配置

#### ButtonLoading 组件属性

| Property                    | Type            | Default   | Description                                     |
| --------------------------- | --------------- | --------- | ----------------------------------------------- |
| **ButtonLoading.state**     | number          | 0         | 状态 0:默认, 1:加载, 2:禁用, 3:成功, 默认状态 0 |
| **ButtonLoading.styleMode** | number          | 1         | 样式（目前只有 1）                              |
| **ButtonLoading.type**      | string          | undefined | 类型 button, submit, reset, undefined           |
| **ButtonLoading.className** | string          | ''        | 类名                                            |
| **ButtonLoading.children**  | React.ReactNode | undefined | ReactNode（必需）                               |

#### ButtonLoadingState 加载按钮状态

| Property                       | Description |
| ------------------------------ | ----------- |
| **ButtonLoadingState.DEFAULT** | 默认        |
| **ButtonLoadingState.LOADING** | 加载        |
| **ButtonLoadingState.DISABLE** | 禁用        |
| **ButtonLoadingState.SUCCESS** | 成功        |

## 注意事项

- 按钮样式中 width, height, border-radius, color, font-size 通过组件父级设置。
- 目前只有 1 套按钮样式，如果新增，在 index.less 中添加。
