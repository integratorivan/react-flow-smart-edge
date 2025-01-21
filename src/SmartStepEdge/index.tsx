import { useNodes } from '@xyflow/react'
import React from 'react'
import { SmartEdge } from '../SmartEdge'
import {
	pathfindingJumpPointNoDiagonal,
	svgDrawStraightLinePath
} from '../functions'
import type { SmartEdgeOptions } from '../SmartEdge'
import type { EdgeProps, Node, Edge } from '@xyflow/react'

const StepConfiguration: SmartEdgeOptions = {
	drawEdge: svgDrawStraightLinePath,
	generatePath: pathfindingJumpPointNoDiagonal,
	fallback: undefined
}

export function SmartStepEdge<
	EdgeDataType extends Edge<Record<string, unknown>, string | undefined> = Edge<
		Record<string, unknown>,
		string | undefined
	>,
	NodeDataType extends Node = Node
>(props: EdgeProps<EdgeDataType>) {
	const nodes = useNodes<NodeDataType>()

	return (
		<SmartEdge
			{...props}
			options={StepConfiguration}
			nodes={nodes as Node<NodeDataType>[]}
		/>
	)
}
