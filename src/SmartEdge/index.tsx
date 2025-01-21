import { BezierEdge, BaseEdge } from '@xyflow/react'
import React from 'react'
import { getSmartEdge } from '../getSmartEdge'
import type { GetSmartEdgeOptions } from '../getSmartEdge'
import type { EdgeProps, Node, Edge } from '@xyflow/react'

export type EdgeElement = typeof BezierEdge

export type SmartEdgeOptions = GetSmartEdgeOptions & {
	fallback?: EdgeElement
}
export interface SmartEdgeProps<
	EdgeDataType extends Edge<Record<string, unknown>> = Edge<
		Record<string, unknown>
	>,
	NodeDataType extends Record<string, unknown> = Record<string, unknown>
> extends EdgeProps<EdgeDataType> {
	nodes: Node<NodeDataType>[]
	options: SmartEdgeOptions
}

export function SmartEdge<
	EdgeDataType extends Edge<Record<string, unknown>> = Edge<
		Record<string, unknown>
	>,
	NodeDataType extends Record<string, unknown> = Record<string, unknown>
>({
	nodes,
	options,
	...edgeProps
}: SmartEdgeProps<EdgeDataType, NodeDataType>) {
	const {
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		style,
		label,
		labelStyle,
		labelShowBg,
		labelBgStyle,
		labelBgPadding,
		labelBgBorderRadius,
		markerEnd,
		markerStart,
		interactionWidth
	} = edgeProps

	const smartResponse = getSmartEdge({
		sourcePosition,
		targetPosition,
		sourceX,
		sourceY,
		targetX,
		targetY,
		options,
		nodes
	})

	const FallbackEdge = options.fallback || BezierEdge

	if (smartResponse === null) {
		return <FallbackEdge {...edgeProps} />
	}

	const { edgeCenterX, edgeCenterY, svgPathString } = smartResponse

	return (
		<BaseEdge
			path={svgPathString}
			labelX={edgeCenterX}
			labelY={edgeCenterY}
			label={label}
			labelStyle={labelStyle}
			labelShowBg={labelShowBg}
			labelBgStyle={labelBgStyle}
			labelBgPadding={labelBgPadding}
			labelBgBorderRadius={labelBgBorderRadius}
			style={style}
			markerStart={markerStart}
			markerEnd={markerEnd}
			interactionWidth={interactionWidth}
		/>
	)
}

export type SmartEdgeFunction = typeof SmartEdge
