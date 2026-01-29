
import { describe, test, expect } from 'vitest';
import { generateContent } from '../contentGenerator';

describe('contentGenerator', () => {
    test('generates YouTube Shorts content correctly', () => {
        const topic = 'Test Topic';
        const result = generateContent('YouTube Shorts', topic);
        expect(result.platform).toBe('YouTube Shorts');
        expect(result.topic).toBe(topic);
        expect(result.duration).toBe('60초');
        expect(result.structure).toBe('How-to / 튜토리얼');
    });

    test('generates Instagram Reels content correctly', () => {
        const topic = 'Test Topic';
        const result = generateContent('Instagram Reels', topic);
        expect(result.platform).toBe('Instagram Reels');
        expect(result.structure).toBe('비포&애프터 / 감성');
    });

    test('generates Naver Blog content correctly', () => {
        const topic = 'Test Topic';
        const result = generateContent('Naver Blog', topic);
        expect(result.platform).toBe('Naver Blog');
        expect(result.length).toBe('1500자 내외');
    });

    test('generates Threads content correctly', () => {
        const topic = 'Test Topic';
        const result = generateContent('Threads', topic);
        expect(result.platform).toBe('Threads');
        expect(result.structure).toBe('대화형 / 팁 나눔');
    });

    test('returns null for unknown platform', () => {
        const result = generateContent('Unknown Platform', 'test');
        expect(result).toBeNull();
    });
});
