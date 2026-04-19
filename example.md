config/variants.ts
````ts
import { VariantsFactory } from "@nativescript-react-tools/variants";

export const MyVariants = new VariantsFactory({
    blue: '#2e6ddf',
    red: '#df2e2e',
})
````

components/mybutton.tsx
````tsx
import * as React from 'react'
import { VariantComponentProps } from "@nativescript-react-tools/variants";
import { MyVariants } from " ~/config/variants";

const variants = MyVariants.variants(t => ({
    base: {
        fontSize: 24
    },
    configs: {
        textColor: {
            blue: {
                color: t.blue,
            },
            red: {
                color: t.red,
            }
        },
        fontType: {
            bold: {
                fontWeight: 'bold',
            },
            normal: {
                fontWeight: 'normal',
            }
        }
    }
}))

type ButtonProps = VariantComponentProps<typeof variants, 'button'>

export function MyButton(props: ButtonProps) {
    const styles = variants.useVariants(props)

    return <button {...props} style={styles} />
}
````

Screen.tsx
````tsx
export function Screen({ navigation }: ScreenOneProps) {
    return (
        <flexboxLayout flexDirection='column'>
            <label
                className="fas"
                style={styles.text}
            >
                &#xf135; You're viewing screen one!
            </label>
            <MyButton
                textColor='blue'
                fontType='bold'
                onTap={() => Dialogs.alert("Tapped!")}
            >
                Tap me for an alert
            </MyButton>
            <MyButton
                textColor='red'
                fontType='normal'
                onTap={() => navigation.navigate("Two", { message: "Hello, world!" })}
            >
                Go to next screen
            </MyButton>
        </flexboxLayout>
    );
}
````