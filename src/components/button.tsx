'use client'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps, CSSProperties } from 'react'

export const buttonVariants = tv({
	base: [
		'inline-flex cursor-pointer items-center justify-center font-medium rounded-full border transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
	],
	variants: {
		variant: {
			filled: 'border-transparent bg-primary text-button-text hover:bg-secondary',
			outline: 'border-primary bg-transparent text-primary hover:bg-primary hover:text-button-text',
			dark: 'border-transparent bg-stone-800 text-stone-200 hover:bg-stone-900',
			custom: [
				'border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--btn-text)]',
				'hover:bg-[var(--btn-bg-hover)]',
			],
		},
		size: {
			sm: 'h-10 px-6 gap-2 text-sm [&_svg]:size-4',
			md: 'h-12 px-8 gap-2.5 text-base [&_svg]:size-5',
			lg: 'h-14 px-10 gap-3 text-lg [&_svg]:size-5',
		},
	},
	defaultVariants: { variant: 'filled', size: 'md' },
})

export interface ButtonCustomColors {
	bg: string
	bgHover?: string
	text: string
	border?: string
}

export interface ButtonProps
	extends ComponentProps<'button'>,
		VariantProps<typeof buttonVariants> {
	customColors?: ButtonCustomColors
}

function getCustomColorStyles(colors: ButtonCustomColors): CSSProperties {
	return {
		'--btn-bg': colors.bg,
		'--btn-bg-hover': colors.bgHover ?? colors.bg,
		'--btn-text': colors.text,
		'--btn-border': colors.border ?? 'transparent',
	} as CSSProperties
}

export function Button({
	className,
	variant,
	size,
	disabled,
	children,
	type = 'button',
	style,
	customColors,
	...props
}: ButtonProps) {
	const finalVariant = customColors ? 'custom' : variant
	const customStyles = customColors ? getCustomColorStyles(customColors) : {}

	return (
		<button
			type={type}
			data-slot="button"
			data-disabled={disabled ? '' : undefined}
			className={twMerge(buttonVariants({ variant: finalVariant, size }), className)}
			style={{ ...customStyles, ...style }}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	)
}
