import { Grid } from 'pathfinding'
import {
	guaranteeWalkablePath,
	getNextPointFromPosition
} from './guaranteeWalkablePath'
import { graphToGridPoint } from './pointConversion'
import type { NodeBoundingBox, GraphBoundingBox } from './getBoundingBoxes'
import type { Position } from '@xyflow/react'

export type PointInfo = {
	x: number
	y: number
	position: Position
}

export const createGrid = (
	graph: GraphBoundingBox,
	nodes: NodeBoundingBox[],
	source: PointInfo,
	target: PointInfo,
	gridRatio = 10,
	bufferZone = 2
) => {
	const { xMin, yMin, width, height } = graph

	const mapColumns = Math.ceil(width / gridRatio) + 1
	const mapRows = Math.ceil(height / gridRatio) + 1

	if (mapColumns <= 0 || mapRows <= 0) {
		throw new Error('Invalid grid dimensions')
	}

	const grid = new Grid(mapColumns, mapRows)

	const safeSetWalkable = (x: number, y: number, walkable: boolean) => {
		const clampedX = Math.max(0, Math.min(x, mapColumns - 1))
		const clampedY = Math.max(0, Math.min(y, mapRows - 1))
		grid.setWalkableAt(clampedX, clampedY, walkable)
	}

	nodes.forEach((node) => {
		const nodeStart = graphToGridPoint(node.topLeft, xMin, yMin, gridRatio)
		const nodeEnd = graphToGridPoint(node.bottomRight, xMin, yMin, gridRatio)

		for (let x = nodeStart.x - bufferZone; x <= nodeEnd.x + bufferZone; x++) {
			for (let y = nodeStart.y - bufferZone; y <= nodeEnd.y + bufferZone; y++) {
				safeSetWalkable(x, y, false)
			}
		}
	})

	const clampToGrid = (value: number, max: number) =>
		Math.max(0, Math.min(max - 1, Math.round(value)))

	const startGrid = {
		x: clampToGrid((source.x - xMin) / gridRatio, mapColumns),
		y: clampToGrid((source.y - yMin) / gridRatio, mapRows)
	}

	const endGrid = {
		x: clampToGrid((target.x - xMin) / gridRatio, mapColumns),
		y: clampToGrid((target.y - yMin) / gridRatio, mapRows)
	}

	const startingNode = grid.getNodeAt(startGrid.x, startGrid.y)
	const endingNode = grid.getNodeAt(endGrid.x, endGrid.y)

	// Check if nodes exist before proceeding
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!startingNode || !endingNode) {
		throw new Error('Start or end node not found in the grid')
	}

	guaranteeWalkablePath(grid, startingNode, source.position)
	guaranteeWalkablePath(grid, endingNode, target.position)

	const start = getNextPointFromPosition(startingNode, source.position)
	const end = getNextPointFromPosition(endingNode, target.position)

	return {
		grid,
		start: { x: start.x, y: start.y },
		end: { x: end.x, y: end.y }
	}
}
