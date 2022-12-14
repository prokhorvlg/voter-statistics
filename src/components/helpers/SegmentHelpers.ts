import { baseSegments } from "../../data/BaseSegments";
import { ISegment, IWard } from "../../interfaces/VoterData";

// Given wards, return new segments by aggregating ward data.
export const getSegmentsFromWards = (wards: IWard[]): ISegment[] => {
    // Create dictionary to contain data.
    let segments: ISegment[] = baseSegments

    // TOTAL COUNTS
    // Cycle through each ward and aggregate the total counts for each segment.
    wards.forEach((ward) => {
        segments.forEach((segment) => {
            if (!segment.ignoreForCount) {
                const wardValue = ward[segment.key] as number
                // Add to the total count for that segment
                if (segment.count) {
                    segment.count = segment.count + wardValue
                } else {
                    segment.count = wardValue
                }
            }
        })
    })

    // PERCENTAGES
    const totalSegment = getSegmentByKey("total", segments)
    // Calculate percentages based on relation to total segment count
    if (totalSegment) {
        segments.forEach((segment) => {
            if (!segment.ignoreForPercent && segment.count && totalSegment.count) {
                segment.percentage = (segment.count / totalSegment.count) * 100
            }
        })
    }

    return segments
}

// Given segments, return a segment matching key.
export const getSegmentByKey = (key: string, segments: ISegment[]): ISegment | undefined => {
    return segments.find((segment) => segment.key === key)
}

// Given segments, return the key of top segment (segment with the highest count).
export const getTopSegmentFromSegments = (segments: ISegment[]): string => {
    let currentTopSegment = ""
    let currentTopCount = -1
    // For each segment, oust the top if its count is higher
    segments.forEach((segment) => {
        if (!segment.ignoreForTop && segment.count) {
            if (currentTopSegment === "") {
                // If this just started, set this as the top segment
                currentTopSegment = segment.key
                currentTopCount = segment.count
            } else {
                // Compare to current top and oust if higher
                if (segment.count > currentTopCount) {
                    currentTopSegment = segment.key
                    currentTopCount = segment.count
                }
            }
        }
    })
    return currentTopSegment
}

// Given a number, returns a formatted version with commas.
export const formatNumberWithCommas = (number: number | string) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}