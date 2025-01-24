import {
	createGrid,
	getBoundingBoxes,
	gridToGraphPoint,
	pathfindingAStarDiagonal,
	svgDrawSmoothLinePath,
	toInteger
} from '../functions'
import type {
	PointInfo,
	PathFindingFunction,
	SVGDrawFunction
} from '../functions'
import type { Node, EdgeProps } from '@xyflow/react'

export type EdgeParams = Pick<
	EdgeProps,
	| 'sourceX'
	| 'sourceY'
	| 'targetX'
	| 'targetY'
	| 'sourcePosition'
	| 'targetPosition'
>

export type GetSmartEdgeOptions = {
	gridRatio?: number
	nodePadding?: number
	drawEdge?: SVGDrawFunction
	generatePath?: PathFindingFunction
	fallbackPath?: (params: EdgeParams) => string
}
export type GetSmartEdgeParams<
	NodeDataType extends Record<string, unknown> = Record<string, unknown>
> = EdgeParams & {
	options?: GetSmartEdgeOptions
	nodes: Node<NodeDataType>[]
}

export type GetSmartEdgeReturn = {
	svgPathString: string
	edgeCenterX: number
	edgeCenterY: number
}

export const getSmartEdge = <
	NodeDataType extends Record<string, unknown> = Record<string, unknown>
>({
	options = {},
	nodes = [],
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition
}: GetSmartEdgeParams<NodeDataType>): GetSmartEdgeReturn | null => {
	try {
		const {
			drawEdge = svgDrawSmoothLinePath,
			generatePath = pathfindingAStarDiagonal,
			fallbackPath,
			gridRatio = 10,
			nodePadding = 15
		} = options

		// Валидация параметров
		const validatedGridRatio = Math.max(toInteger(gridRatio), 5)
		const validatedNodePadding = Math.max(toInteger(nodePadding), 5)

		const { graphBox, nodeBoxes } = getBoundingBoxes<NodeDataType>(
			nodes,
			validatedNodePadding,
			validatedGridRatio
		)

		const source: PointInfo = {
			x: sourceX,
			y: sourceY,
			position: sourcePosition
		}

		const target: PointInfo = {
			x: targetX,
			y: targetY,
			position: targetPosition
		}

		const { grid, start, end } = createGrid(
			graphBox,
			nodeBoxes,
			source,
			target,
			validatedGridRatio
		)

		// Поиск пути с обработкой ошибок
		const generatePathResult = generatePath(grid, start, end)
		if (!generatePathResult?.fullPath.length) {
			return fallbackPath
				? {
						svgPathString: fallbackPath({
							sourceX,
							sourceY,
							targetX,
							targetY,
							sourcePosition,
							targetPosition
						}),
						edgeCenterX: (sourceX + targetX) / 2,
						edgeCenterY: (sourceY + targetY) / 2
				  }
				: null
		}

		const { fullPath, smoothedPath } = generatePathResult

		// Оптимизация преобразования координат
		const graphPath = smoothedPath.map(([x, y]) => {
			const point = gridToGraphPoint(
				{ x, y },
				graphBox.xMin,
				graphBox.yMin,
				validatedGridRatio
			)
			return [point.x, point.y]
		})

		// Генерация SVG пути
		const svgPathString =
			drawEdge(source, target, graphPath) ||
			fallbackPath?.({
				sourceX,
				sourceY,
				targetX,
				targetY,
				sourcePosition,
				targetPosition
			}) ||
			`M ${sourceX},${sourceY} L ${targetX},${targetY}`

		// Расчет центральной точки
		const midIndex = Math.floor(fullPath.length / 2)
		const [midX, midY] = fullPath[midIndex] || [0, 0]
		const { x: edgeCenterX, y: edgeCenterY } = gridToGraphPoint(
			{ x: midX, y: midY },
			graphBox.xMin,
			graphBox.yMin,
			validatedGridRatio
		)

		return { svgPathString, edgeCenterX, edgeCenterY }
	} catch (error) {
		console.error('Smart Edge Error:', error)
		return null
	}
}
