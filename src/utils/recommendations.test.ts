import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getRecommendation } from './recommendations.ts';

describe('getRecommendation', () => {
  it('should return NEC code recommendation', () => {
    const rec = getRecommendation('NEC code');
    assert.ok(rec.length > 0);
    assert.ok(rec.toLowerCase().includes('nfpa') || rec.toLowerCase().includes('nec') || rec.toLowerCase().includes('grounding'));
  });

  it('should return theory recommendation', () => {
    const rec = getRecommendation('theory');
    assert.ok(rec.length > 0);
    assert.ok(rec.toLowerCase().includes('ohm') || rec.toLowerCase().includes('circuit'));
  });

  it('should return safety recommendation', () => {
    const rec = getRecommendation('safety');
    assert.ok(rec.length > 0);
    assert.ok(rec.toLowerCase().includes('osha') || rec.toLowerCase().includes('nfpa'));
  });

  it('should return troubleshooting recommendation', () => {
    const rec = getRecommendation('troubleshooting');
    assert.ok(rec.length > 0);
    assert.ok(rec.toLowerCase().includes('diagnostic') || rec.toLowerCase().includes('testing'));
  });

  it('should return a generic fallback for unknown categories', () => {
    const rec = getRecommendation('management' as any);
    assert.ok(rec.length > 0);
    assert.ok(rec.includes('management'));
  });

  it('should include the category name in the fallback message', () => {
    const rec = getRecommendation('behavioral' as any);
    assert.ok(rec.includes('behavioral'));
  });
});
